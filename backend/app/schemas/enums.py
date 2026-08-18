from enum import StrEnum


class QuestionCategory(StrEnum):
    speaking = "speaking"
    writing = "writing"
    reading = "reading"
    listening = "listening"


class QuestionDifficulty(StrEnum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class SpeakingType(StrEnum):
    read_aloud = "read-aloud"
    repeat_sentence = "repeat-sentence"
    describe_image = "describe-image"
    retell_lecture = "retell-lecture"
    answer_short_question = "answer-short-question"
    summarize_spoken_test = "summarize-spoken-test"
    response_to_a_situation = "response-to-a-situation"
    personal_introduction = "personal-introduction"


class WritingType(StrEnum):
    summarize_written_text = "summarize-written-text"
    essay = "essay"


class ReadingType(StrEnum):
    fill_in_the_blanks = "fill-in-the-blanks"
    re_order_paragraphs = "re-order-paragraphs"
    multiple_choice_single = "multiple-choice-single"


class ListeningType(StrEnum):
    summarize_spoken_test = "summarize-spoken-test"
    multiple_choice_single = "multiple-choice-single"
    fill_in_the_blanks = "fill-in-the-blanks"
