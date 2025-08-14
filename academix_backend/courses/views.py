from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, Module, Topic
from .serializers import CourseSerializer
import google.generativeai as palm
import re
import json

palm.configure(api_key=settings.GEMINI_API_KEY)
gemini_model = palm.GenerativeModel(model_name="models/gemini-1.5-flash")

class CreateCourseView(APIView):
    def post(self, request):
        subject = request.data.get("subject")

        prompt = f"""
        Create 6-8 modules with 3-5 topics each to teach: {subject}.
        Return in structured JSON like:
        {{"modules": [{{"title": "Module Title", "topics": ["Topic 1", "Topic 2"]}}]}}
        """

        response = gemini_model.generate_content(prompt)
        
        # Extract the text from Gemini's response
        raw_text = response.candidates[0].content.parts[0].text.strip()

        # Remove triple backticks and optional "json" label
        raw_text = re.sub(r"^```(json)?", "", raw_text)
        raw_text = re.sub(r"```$", "", raw_text).strip()

        # Parse JSON safely
        try:
            data = json.loads(raw_text)
        except json.JSONDecodeError as e:
            return Response({"error": "Invalid JSON from model", "details": str(e)}, status=500)

        course = Course.objects.create(title=subject)
        for m in data["modules"]:
            mod = Module.objects.create(course=course, title=m["title"])
            for t in m["topics"]:
                Topic.objects.create(module=mod, title=t)

        return Response(CourseSerializer(course).data)

