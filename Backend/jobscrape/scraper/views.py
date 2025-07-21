from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import asyncio
from playwright.async_api import async_playwright
import requests
import json
import re
from jobscaper_api import settings
from rest_framework import generics
from .models import JobLink
from .serializers import JobLinkSerializer
from userauth.models import User

class FetchJobInfoView(APIView):

    def post(self, request):
        url = request.data.get("url")
        if not url:
            return Response({"error": "Job URL is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job_info = asyncio.run(self.extract_job_data(url))
            return Response(job_info, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def extract_job_data(self, url):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, timeout=60000)
            content = await page.content()
            visible_text = await page.inner_text('body')
            await browser.close()

        # Send to Gemini
        gemini_response = self.call_gemini(visible_text)

        return gemini_response
    
    
    

    def call_gemini(self, text):
        GEMINI_API_KEY = settings.env('GEMINI_API_KEY')
        endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

        headers = {
            "Content-Type": "application/json",
        }

        prompt = f"""
        Extract the following information from this job listing text:
        - Job Title
        - Company Name
        - Job Description
        - Platform (e.g. LinkedIn, Indeed)
        - Location (e.g. United states, remote)
        - Job Type (e.g, Remote, On-site, Hybrid)
        - Pay (range or single value, like “$60,000 - $80,000”, if amount not found, put Undisclosed)

        Format the result as JSON like:
        {{
            "title": "...",
            "company": "...",
            "platform": "...",
            "location": "...",
            "job_type": "...",
            "pay": "..."
        }}

        Text:
        {text}
        """

        payload = {
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }

        params = {"key": GEMINI_API_KEY}

        response = requests.post(endpoint, headers=headers, params=params, json=payload)
        data = response.json()



        try:
            text_output = data["candidates"][0]["content"]["parts"][0]["text"]

            # Remove triple backticks and everything between if present
            cleaned_text = re.sub(r"```json|```", "", text_output).strip()

            # Convert string to dict safely
            parsed = json.loads(cleaned_text)

            # Only return needed fields
            return {
                "title": parsed.get("title"),
                "company": parsed.get("company"),
                "platform": parsed.get("platform"),
                "location": parsed.get("location"),
                "job_type": parsed.get("job_type"),
                "pay": parsed.get("pay")
            }

        except Exception as e:
            return {
                "error": "Failed to parse Gemini output",
                "details": str(e),
                "raw": text_output,
            }







#For saving info the Database.
class JobLinkListCreateView(generics.ListCreateAPIView):
    serializer_class = JobLinkSerializer

    def get_queryset(self):
        # Get user by email or id from query param
        email = self.request.query_params.get('email')
        user_id = self.request.query_params.get('user_id')
        user = None

        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JobLink.objects.none()
        elif user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JobLink.objects.none()
            
        else:
            return JobLink.objects.none()
        return JobLink.objects.filter(user=user).order_by('-created_at')
    
    

    def perform_create(self, serializer):
        # Get user by email or id from request data
        email = self.request.data.get('email')
        user_id = self.request.data.get('user_id')
        user = None

        if email:
            user = User.objects.get(email=email)
        elif user_id:
            user = User.objects.get(id=user_id)
        else:
            raise Exception('User email or id required')
        

        # Check for duplicate job for this user
        job_exists = JobLink.objects.filter(
            user=user,
            title=self.request.data.get('title'),
            company=self.request.data.get('company'),
            platform=self.request.data.get('platform'),
            location=self.request.data.get('location'),
            job_type=self.request.data.get('job_type'),
            pay=self.request.data.get('pay'),
        ).exists()
        if job_exists:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'error': 'You have already saved this job.'})
        serializer.save(user=user)




class JobLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobLinkSerializer

    def get_queryset(self):
        # Get user by email or id from query param
        email = self.request.query_params.get('email')
        user_id = self.request.query_params.get('user_id')
        user = None

        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JobLink.objects.none()
            
        elif user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JobLink.objects.none()
            
        else:
            return JobLink.objects.none()
        return JobLink.objects.filter(user=user)
    



    def destroy(self, request, *args, **kwargs):
        # Only allow delete if the job belongs to the user
        email = request.query_params.get('email')
        user_id = request.query_params.get('user_id')
        user = None


        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                from rest_framework.response import Response
                return Response({'error': 'User not found.'}, status=403)
            
        elif user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                from rest_framework.response import Response
                return Response({'error': 'User not found.'}, status=403)
            
        else:
            from rest_framework.response import Response
            return Response({'error': 'User email or id required.'}, status=403)
        instance = self.get_object()

        if instance.user != user:
            from rest_framework.response import Response
            return Response({'error': 'You do not have permission to delete this job.'}, status=403)
        return super().destroy(request, *args, **kwargs)