from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from courses.models import Topic
import openai

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

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )

        return Response({"reply": response.choices[0].message.content})
