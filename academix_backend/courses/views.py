from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, Module, Topic
from .serializers import CourseSerializer
import openai
import ast

openai.api_key = "YOUR_OPENAI_API_KEY"

class CreateCourseView(APIView):
    def post(self, request):
        subject = request.data.get("subject")

        prompt = f"""
        Create 6-8 modules with 3-5 topics each to teach: {subject}.
        Return in structured JSON like:
        {{"modules": [{{"title": "Module Title", "topics": ["Topic 1", "Topic 2"]}}]}}
        """

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.6
        )

        course = Course.objects.create(title=subject)
        data = ast.literal_eval(response.choices[0].message.content)

        for m in data["modules"]:
            mod = Module.objects.create(course=course, title=m["title"])
            for t in m["topics"]:
                Topic.objects.create(module=mod, title=t)

        return Response(CourseSerializer(course).data)

