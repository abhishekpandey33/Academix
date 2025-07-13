from rest_framework import serializers
from .models import Course, Module, Topic

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True, source='topic_set')
    class Meta:
        model = Module
        fields = ['id', 'title', 'topics']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True, source='module_set')
    class Meta:
        model = Course
        fields = ['id', 'title', 'modules']