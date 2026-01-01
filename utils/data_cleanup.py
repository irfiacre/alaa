# Used to make a dataset that is compatible with the model "DeepSeek-R1-Distill-Qwen-7B".

"""
Approach:

2. Finalize the dataset & Push it to hugging face.
"""
import json
import pypdf
from enchant.checker import SpellChecker

reader = pypdf.PdfReader('data/raw/offences_and_penalties_in_general_2018.pdf')

english_spell_check = SpellChecker("en_GB")

def validate_english_phrase(phrase:str)-> bool:
    english_spell_check.set_text(phrase)
    for err in english_spell_check:
        if err.word and "rwanda" not in err.word:
            with open("logs/log.txt", "a", encoding='utf-8') as log_file:
                log_file.write(phrase + "\n")
            return False
    return True

def build_article_summary() -> list:
    """
    Returns a list of english text
    """
    part_title = ""
    chapter_title = "" 
    title_title = ""
    section_title = ""
    sub_section_title = ""
    result = []
    for page in reader.pages[1:43]:
        page_text = page.extract_text()
        split_text = page_text.split("\n \n")
        n = len(split_text)
        diviser = len(split_text)//3
        split_text = split_text[diviser+1: n - (diviser-3)]

        for text in split_text:
            temp = text.strip().split(":")
            if len(temp) <= 1:
                continue
            text_title = temp[0].strip().capitalize()
            text_definition = temp[1].strip().split("\n")
            text_phrase = f'{text_title}: {"".join(text_definition).capitalize()}'
            if not validate_english_phrase(text_phrase):
                continue
            if "PART" in temp[0].strip():
                part_title = text_phrase
                continue
            elif "TITLE" in temp[0].strip():
                title_title = text_phrase
                continue
            elif "CHAPTER" in temp[0].strip():
                chapter_title = text_phrase
                continue
            elif "subsection" in text_phrase.lower():
                sub_section_title = text_phrase
                continue
            elif "section" in text_phrase.lower():
                section_title = text_phrase
                sub_section_title = ""
                continue
            dataset_dict = {
                    "instruction": "Explain the summary of the law articles, as mentioned in the Rwandan Official Gazette no. Special of 27/09/2018",
                    "input": f"What is {temp[0]} of {part_title}, {title_title}, {chapter_title}{' ,'+section_title if section_title else ''}, {' ,'+sub_section_title if sub_section_title else ''}?",
                    "output": f"{text_phrase}"
            }
            result.append(dataset_dict)
    
    return result

if __name__=="__main__":
    print(json.dumps(build_article_summary()))