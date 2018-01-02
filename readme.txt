README FILE FOR APRIL L. HAMILTON'S VISUAL TAROT ALEXA SKILL, DATED 1/1/18.

I CANNOT PROMISE MY PROGRAMMATIC SOLUTIONS HERE ARE THE MOST ELEGANT
OR INGENIOUS, BUT I *CAN* GUARANTEE THEY WORK BECAUSE THIS SKILL
IS NOW LIVE IN THE SKILL STORE OF EVERY AMAZON REGION WHERE ENGLISH
IS A SUPPORTED LANGUAGE AND ALEXA DEVICES WITH SCREENS ARE AVAILABLE.

THE SKILL IS WRITTEN IN JAVASCRIPT AND IS BUNDLED WITH THE 
ALEXA SDK FOR NODE (https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)
THAT WAS CURRENT AT THE TIME OF THE SKILL'S PUBLICATION, IN
NOVEMBER OF 2017.

THE LIVE SKILL IS HOSTED ON AMAZON'S LAMBDA SERVICE, AND ALL
GRAPHIC ASSETS ARE STORED IN AN AMAZON S3 BUCKET.

THIS CODE EMPLOYS AND ILLUSTRATES THE FOLLOWING METHODS,
FUNCTIONS AND ITEMS:

==================================================================

NewSession 

Use of sessionAttributes to persist skill data in-session

Select random, non-consecutive items from an array (virtual coin toss)

Display.RenderTemplate directive, used with ListTemplate2 and BodyTemplate2

ElementSelected to capture user touch selections from Display Template screens

selectNumberIntent to capture spoken list number selections from Display Template screens

Use of SSML tags for outputSpeech

Play welcome/instruction message only on first screen load

Drill-down through up to three menu/list screen levels

Control user navigation back and forth through screens via use of a custom
AMAZON.PreviousIntent handler

SessionEndedRequest cleanup to address Lambda latency issues

===================================================================

PLEASE SEE LICENSE.TXT FOR USAGE GUIDELINES.

PLEASE SEE THE DEEP DIVE BLOG SERIES ABOUT THIS SKILL ON THE LOVE MY ECHO
SITE FOR A THOROUGH WALKTHROUGH OF ALL ASPECTS OF THIS SKILL AND ITS CODE.
THE SERIES BEGINS AT:
https://lovemyecho.com/2017/12/19/alexadev-tuesday-alexa-display-template-skill-design-and-coding-deep-dive-introduction/

APRIL CAN BE REACHED VIA THE CONTACT FORM ON THE LOVE MY ECHO SITE:
https://lovemyecho.com/contact-love-my-echo/


