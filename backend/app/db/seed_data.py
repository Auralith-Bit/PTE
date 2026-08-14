# ruff: noqa: E501
"""Starter question bank, seeded from the frontend's hardcoded practice content."""

SPEAKING_READ_ALOUD = [
    "The rapid advancement of technology has transformed the way we live, work and communicate. Artificial intelligence and automation are becoming increasingly integrated in our daily routines, offering both opportunities and challenges. As we embrace these changes, it is essential to adapt and acquire new skills to remain relevant in this ever-evolving world.",
    "Climate change remains one of the most pressing issues of our time, affecting ecosystems, economies, and communities worldwide. Governments and organizations are increasingly investing in renewable energy and sustainable practices to reduce carbon emissions and mitigate long-term environmental damage.",
    "Effective communication is a cornerstone of successful teamwork in any organization. Clear, concise, and respectful dialogue helps prevent misunderstandings and builds trust among colleagues, ultimately leading to higher productivity and a more positive work environment.",
    "The rise of remote work has reshaped traditional office culture, giving employees greater flexibility while also introducing new challenges around collaboration and work-life balance. Companies are experimenting with hybrid models to find an approach that suits both business needs and employee wellbeing.",
    "Reading regularly has been shown to improve vocabulary, critical thinking, and empathy. By exposing readers to diverse perspectives and unfamiliar situations, books encourage a deeper understanding of the world and the people who inhabit it.",
    "Urban planning plays a crucial role in shaping how cities function and how residents experience daily life. Thoughtful design of public spaces, transportation networks, and housing can significantly improve quality of life while reducing environmental impact.",
    "The global shift toward e-commerce has changed consumer behavior dramatically over the past decade. Businesses must now prioritize digital experience, fast delivery, and personalized service to remain competitive in an increasingly crowded marketplace.",
    "Scientific research relies heavily on collaboration across disciplines to solve complex problems. By combining expertise from fields such as biology, computer science, and engineering, researchers can develop innovative solutions to challenges that no single discipline could address alone.",
    "Financial literacy is an essential life skill that is often overlooked in traditional education systems. Understanding concepts such as budgeting, saving, and investing empowers individuals to make informed decisions and build long-term financial security.",
    "Travel broadens perspective by exposing individuals to different cultures, languages, and ways of life. Even short trips to unfamiliar places can challenge assumptions and foster a greater appreciation for the diversity of human experience.",
]

SPEAKING_REPEAT_SENTENCES = [
    "The professor explained that the experiment yielded unexpected results.",
    "Students are required to submit their assignments before the deadline.",
    "The new policy will take effect starting next month.",
    "Climate change is one of the most significant challenges facing humanity today.",
    "The company decided to expand its operations into international markets.",
    "Regular exercise and a balanced diet are essential for maintaining good health.",
    "The museum houses an impressive collection of modern art from around the world.",
    "Advances in technology have revolutionized the way we communicate with each other.",
    "The government announced new measures to reduce carbon emissions by thirty percent.",
    "Research shows that reading for pleasure improves both vocabulary and comprehension.",
]

SPEAKING_DESCRIBE_IMAGES = [
    f"/images/describeimage{i}.png" for i in range(1, 11)
]

SPEAKING_RETELL_LECTURES = [
    {
        "title": "The Water Cycle",
        "notes": "The water cycle describes how water moves through the environment. Evaporation turns water into vapor, which rises and forms clouds. When clouds cool, condensation occurs and precipitation falls back to Earth, replenishing rivers, lakes, and groundwater.",
    },
    {
        "title": "Photosynthesis",
        "notes": "Plants convert sunlight, carbon dioxide, and water into glucose and oxygen through photosynthesis. This process occurs mainly in leaves using chlorophyll. Photosynthesis is essential for life on Earth as it produces oxygen and forms the base of food chains.",
    },
    {
        "title": "The Industrial Revolution",
        "notes": "The Industrial Revolution began in Britain in the late 18th century. It marked a shift from manual production to machine manufacturing. New inventions like the steam engine and power loom transformed textiles, transportation, and communication, reshaping society.",
    },
    {
        "title": "Plate Tectonics",
        "notes": "The Earth's outer shell is divided into several plates that float on the semi-fluid mantle beneath. These plates move very slowly, driven by convection currents. Where plates collide, mountains form; where they pull apart, new crust is created at mid-ocean ridges.",
    },
    {
        "title": "Supply and Demand",
        "notes": "In economics, supply and demand determine market prices. When demand exceeds supply, prices rise. When supply exceeds demand, prices fall. Producers and consumers interact in markets to reach equilibrium, where the quantity demanded equals the quantity supplied.",
    },
    {
        "title": "The Human Brain",
        "notes": "The human brain contains approximately 86 billion neurons connected by trillions of synapses. The cerebrum handles thinking and memory, the cerebellum controls movement, and the brainstem regulates basic functions like breathing and heart rate.",
    },
    {
        "title": "Globalization",
        "notes": "Globalization refers to the increasing interconnectedness of economies, cultures, and populations worldwide. Driven by trade, technology, and migration, it has created economic growth but also raised concerns about inequality, cultural homogenization, and environmental impact.",
    },
    {
        "title": "Artificial Intelligence",
        "notes": "Artificial intelligence aims to create machines that can perform tasks requiring human intelligence. Machine learning, a subset of AI, allows systems to learn from data. Applications include speech recognition, medical diagnosis, and autonomous vehicles.",
    },
    {
        "title": "Ocean Currents",
        "notes": "Ocean currents are continuous movements of seawater driven by wind, temperature, and salinity differences. They distribute heat around the globe, affecting weather patterns and marine ecosystems. The Gulf Stream, for example, keeps Western Europe warmer than it would otherwise be.",
    },
    {
        "title": "Renewable Energy",
        "notes": "Renewable energy comes from naturally replenishing sources like sunlight, wind, and water. Solar panels convert sunlight to electricity, wind turbines harness wind energy, and hydroelectric dams generate power from flowing water. These sources reduce reliance on fossil fuels.",
    },
]

SPEAKING_SHORT_QUESTIONS = [
    {"question": "What is the largest ocean on Earth?", "answer": "The Pacific Ocean"},
    {"question": "What gas do plants absorb from the atmosphere?", "answer": "Carbon dioxide"},
    {"question": "How many continents are there on Earth?", "answer": "Seven"},
    {"question": "What is the chemical symbol for water?", "answer": "H2O"},
    {"question": "Which planet is known as the Red Planet?", "answer": "Mars"},
    {"question": "What is the main language spoken in Brazil?", "answer": "Portuguese"},
    {"question": "What device measures temperature?", "answer": "A thermometer"},
    {"question": "What is the boiling point of water in Celsius?", "answer": "100 degrees"},
    {"question": "Which organ pumps blood throughout the body?", "answer": "The heart"},
    {"question": "What is the capital of Japan?", "answer": "Tokyo"},
]

WRITING_SUMMARIZE_PASSAGES = [
    "Global warming refers to the long-term heating of Earth's surface observed since the pre-industrial period. The primary drivers are human activities that emit greenhouse gases, especially carbon dioxide and methane. These gases trap heat in the atmosphere, causing average temperatures to rise and leading to melting ice caps, rising sea levels, and more frequent extreme weather events.",
    "The internet has fundamentally changed how people access information and communicate. Before its widespread adoption, knowledge was primarily distributed through print media and broadcast television. Today, anyone with a connection can publish and consume content instantly, enabling collaboration across borders and giving a voice to previously marginalized communities.",
]

WRITING_ESSAY_PROMPTS = [
    "Some people believe that university education should be free for everyone, while others argue that students should pay for their own education. Discuss both views and give your own opinion.",
    "Technology is making people more isolated from one another. To what extent do you agree or disagree with this statement?",
]

READING_FILL_BLANKS = {
    "passage": "The study of history (1) us understand the present. By examining past events, we can identify patterns that (2) to repeat. Governments and institutions often use historical (3) to guide future decisions, ensuring that the mistakes of the past are not (4).",
    "options": {
        "1": ["helps", "help", "helping", "helped"],
        "2": ["tend", "tends", "tended", "tending"],
        "3": ["lesson", "lessons", "lesson's", "lessons'"],
        "4": ["repeated", "repeat", "repeating", "repeats"],
    },
    "correct": {"1": "helps", "2": "tend", "3": "lessons", "4": "repeated"},
}

READING_REORDER_PARAGRAPHS = {
    "paragraphs": [
        "Charles Darwin spent five years aboard the HMS Beagle, collecting specimens and recording observations.",
        "During the voyage, he was particularly struck by the variety of finches on the Galapagos Islands.",
        "These observations led him to develop his theory of natural selection.",
        "His work, published in 1859 as On the Origin of Species, transformed the biological sciences.",
    ],
    "order": [0, 1, 2, 3],
}

READING_MULTIPLE_CHOICE = [
    {
        "passage": "Photosynthesis is the process by which green plants convert sunlight into chemical energy. Using chlorophyll, plants absorb light and combine water and carbon dioxide to produce glucose and oxygen. This process not only feeds the plant but also provides the oxygen that most living organisms depend on.",
        "options": [
            "Plants release carbon dioxide during the day.",
            "Photosynthesis produces glucose and oxygen.",
            "Chlorophyll is only found in flowers.",
            "Glucose is a byproduct that plants discard.",
        ],
        "correct": [1],
    },
    {
        "passage": "The Great Barrier Reef is the world's largest coral reef system, stretching over 2,300 kilometres off the coast of Australia. It hosts a vast diversity of marine life and supports the local tourism industry. However, rising ocean temperatures have caused widespread coral bleaching in recent decades.",
        "options": [
            "The reef is found in the Pacific Ocean near Japan.",
            "Coral bleaching is caused by rising ocean temperatures.",
            "The reef supports only a small number of species.",
            "The Great Barrier Reef is located in the Atlantic Ocean.",
        ],
        "correct": [1],
    },
]

LISTENING_SUMMARIZE = [
    {
        "title": "Sleep and Memory",
        "transcript": "Recent studies suggest that sleep plays a critical role in memory consolidation. During deep sleep, the brain replays the day's experiences, strengthening important neural connections and discarding irrelevant information. Researchers recommend that students prioritise consistent, high-quality sleep, especially before examinations.",
    },
    {
        "title": "Urban Green Spaces",
        "transcript": "Urban green spaces such as parks and community gardens provide measurable benefits to city residents. They improve air quality, reduce the urban heat island effect, and offer spaces for recreation and social interaction. Planners increasingly treat green space as essential infrastructure rather than an optional luxury.",
    },
]

LISTENING_MULTIPLE_CHOICE = [
    {
        "title": "Company Announcement",
        "transcript": "Good afternoon, everyone. Starting next Monday, the company will move to a hybrid working model. Employees are expected to work from the office at least two days per week, and must submit their preferred schedule by the end of this week.",
        "options": [
            "All employees must work from the office every day.",
            "Employees may choose to work fully from home.",
            "The hybrid model starts next Monday.",
            "Schedules are due by the end of the month.",
        ],
        "correct": [2],
    },
]

LISTENING_FILL_BLANKS = {
    "transcript": "The lecture began with a discussion of the (1) of climate change. The speaker then examined the role of government (2) in reducing emissions. Finally, she highlighted the importance of public awareness and individual action.",
    "options": {
        "1": ["causes", "effects", "history", "science"],
        "2": ["policy", "budgets", "departments", "officials"],
    },
    "correct": {"1": "causes", "2": "policy"},
}


def build_seed_questions() -> list[dict]:
    questions: list[dict] = []

    for text in SPEAKING_READ_ALOUD:
        questions.append(
            {
                "category": "speaking",
                "type": "read-aloud",
                "difficulty": "medium",
                "content": {"text": text},
            }
        )
    for sentence in SPEAKING_REPEAT_SENTENCES:
        questions.append(
            {
                "category": "speaking",
                "type": "repeat-sentence",
                "difficulty": "medium",
                "content": {"sentence": sentence},
            }
        )
    for image_url in SPEAKING_DESCRIBE_IMAGES:
        questions.append(
            {
                "category": "speaking",
                "type": "describe-image",
                "difficulty": "medium",
                "content": {"image_url": image_url},
            }
        )
    for lecture in SPEAKING_RETELL_LECTURES:
        questions.append(
            {
                "category": "speaking",
                "type": "retell-lecture",
                "difficulty": "hard",
                "content": {"title": lecture["title"], "notes": lecture["notes"]},
            }
        )
    for sq in SPEAKING_SHORT_QUESTIONS:
        questions.append(
            {
                "category": "speaking",
                "type": "answer-short-question",
                "difficulty": "easy",
                "content": {"question": sq["question"], "answer": sq["answer"]},
            }
        )

    for passage in WRITING_SUMMARIZE_PASSAGES:
        questions.append(
            {
                "category": "writing",
                "type": "summarize-written-text",
                "difficulty": "medium",
                "content": {"passage": passage},
            }
        )
    for prompt in WRITING_ESSAY_PROMPTS:
        questions.append(
            {
                "category": "writing",
                "type": "essay",
                "difficulty": "hard",
                "content": {"prompt": prompt},
            }
        )

    questions.append(
        {
            "category": "reading",
            "type": "fill-in-the-blanks",
            "difficulty": "medium",
            "content": {
                "passage": READING_FILL_BLANKS["passage"],
                "options": READING_FILL_BLANKS["options"],
                "correct": READING_FILL_BLANKS["correct"],
            },
        }
    )
    questions.append(
        {
            "category": "reading",
            "type": "re-order-paragraphs",
            "difficulty": "hard",
            "content": {
                "paragraphs": READING_REORDER_PARAGRAPHS["paragraphs"],
                "order": READING_REORDER_PARAGRAPHS["order"],
            },
        }
    )
    for mc in READING_MULTIPLE_CHOICE:
        questions.append(
            {
                "category": "reading",
                "type": "multiple-choice-single",
                "difficulty": "medium",
                "content": {
                    "passage": mc["passage"],
                    "options": mc["options"],
                    "correct": mc["correct"],
                },
            }
        )

    for item in LISTENING_SUMMARIZE:
        questions.append(
            {
                "category": "listening",
                "type": "summarize-spoken-test",
                "difficulty": "medium",
                "content": {"title": item["title"], "transcript": item["transcript"]},
            }
        )
    for item in LISTENING_MULTIPLE_CHOICE:
        questions.append(
            {
                "category": "listening",
                "type": "multiple-choice-single",
                "difficulty": "medium",
                "content": {
                    "title": item["title"],
                    "transcript": item["transcript"],
                    "options": item["options"],
                    "correct": item["correct"],
                },
            }
        )
    questions.append(
        {
            "category": "listening",
            "type": "fill-in-the-blanks",
            "difficulty": "medium",
            "content": {
                "transcript": LISTENING_FILL_BLANKS["transcript"],
                "options": LISTENING_FILL_BLANKS["options"],
                "correct": LISTENING_FILL_BLANKS["correct"],
            },
        }
    )

    return questions
