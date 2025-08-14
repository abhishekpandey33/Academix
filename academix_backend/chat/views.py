from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from courses.models import Topic
import google.generativeai as palm

palm.configure(api_key=settings.GEMINI_API_KEY)
gemini_model = palm.GenerativeModel(model_name="models/gemini-1.5-flash")

class ChatView(APIView):
    def post(self, request):
        topic_id = request.data.get("topic_id")
        question = request.data.get("message")
        topic = Topic.objects.get(id=topic_id)

        prompt = f"""
        You're helping a student who is learning: {topic.title}
        Content: {topic.content}
        Question: {question}
        Answer in a simple and clear way.
        """

        response = gemini_model.generate_content(prompt)

        return Response({"reply": response.message.content})
