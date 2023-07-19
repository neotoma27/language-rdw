from django.core.exceptions import ValidationError
from django.forms import ModelForm
from lessons.models import VocabMCQuestion

class VocabMCQuestionForm(ModelForm):
    class Meta:
        model = VocabMCQuestion
        fields = ['vocab_word', 'incorrect_answer_options']

    def clean(self):
        """
        Checks that question has exactly three incorrect-answer options
        """
        options = self.cleaned_data.get('incorrect_answer_options')
        correct = self.cleaned_data.get('vocab_word')
        print(options)
        print(correct)
        if (not options) or len(options) != 3:
            raise ValidationError('Question should have exactly three Incorrect answer options.')
        if correct in options:
            raise ValidationError('Incorrect answer options should be different from Vocab word.')
        return self.cleaned_data
