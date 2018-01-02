
//**
// VISUAL TAROT ALEXA SKILL WRITTEN BY APRIL L. HAMILTON.
// COMPATIBLE ONLY WITH ALEXA DEVICES WITH SCREENS.
//
// FROM HOME SCREEN USER CAN SELECT A CARD ENCYCLOPEDIA VIEW,
// OR ONE OF THREE ORACLE CARD SPREADS.
//
// FROM ENCYCLOPEDIA SCREEN USER CAN SELECT MAJOR ARCANA,
// OR FROM AMONG THE FOUR SUITS TO LOAD A LISTING OF 
// ALL CARDS IN THE GROUP.
//
// FROM ENCYCLOPEDIA LIST AND ORACLE CARD SPREAD SCREENS, 
// USER CAN SELECT A SPECIFIC CARD TO VIEW ITS DETAILS.
//
//**

//===========================================================
//================ GENERAL CODE OVERVIEW ====================
//===========================================================
//
// 1. DEFINE DEFAULT WELCOME, HELP AND EXIT MESSAGES.
//
// 2. DEFINE aryDeck ARRAY TO CONTAIN TAROT CARD DATA.
//
// 3. PULL CARDS FOR ALL THREE ORACLE SPREADS AND ASSIGN
//      TO aryReadings ARRAY. ASSIGN aryReadings VALUES
//      TO SESSION ATTRIBUTES.
//
// 4. USE SESSION ATTRIBUTES TO TRACK SCREEN FROM WHICH 
//      USER IS MAKING TOUCH OR VOICE SELECTION, TO FEED
//      INTO ElementSelected & NumberSelected FUNCTIONS. THIS APPROACH
//      ALLOWS EVERY LIST TEMPLATE SCREEN TO HAVE ORDINAL
//      NUMBERS 1 - n ASSIGNED FOR LIST ITEM TOKENS, WHICH
//      APPEARS TO BE NECESSARY TO DRIVE VOICE AND TOUCH
//      SELECTION BACK-END LOGIC, YET STILL ROUTE EACH
//      SELECTION TO THE CORRECT SCREEN OR FUNCTION.
//
// 5. CREATE HANDLER FUNCTIONS TO ROUTE INTENTS / SELECTIONS / EVENTS.
//


'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = '[app id goes here]'; 

var SKILL_NAME = 'Visual Tarot';


var WELCOME_MESSAGE = 'Welcome to Visual Tarot. Select Card Encyclopedia to browse the full Tarot deck. '
                    + 'Select one of the three Tarot spreads for a reading. Say help to get more information.' ;
    
var HELP_MESSAGE = 'Visual Tarot allows you to browse the Tarot deck by suit or Major Arcana, '
                    + 'or to select a Tarot card reading from among three oracle spreads: single card, three card past, '
                    + 'present and future, or the ten card Celtic Cross. '
                    + 'Card images are from the public domain Rider Waite Tarot deck, and meanings are based on Waites '
                    + 'original guide. You can make a selection by list number. ';

var REPROMPT_MESSAGE = 'Please make a selection. ';
    
var STOP_MESSAGE = 'I hope you found this session with the Tarot enlightening. Come back to explore the Tarot again any time. ';

// CARD DATA IS STORED IN aryDeck. CARDS ARE ENTERED IN ORDER WITH UPRIGHT VERSION OF EACH CARD FOLLOWED
// IMMEDIATELY BY THE REVERSED (UPSIDE DOWN) VERSION. IN TAROT READINGS THE INTERPRETATION OF EACH CARD
// VARIES DEPENDING ON WHETHER ITS ORIENTATION IS UPRIGHT OR REVERSED. ENTERING THE CARDS IN THIS ORDER
// IN THE ARRAY ENSURES DISPLAY TEMPLATE LIST SCREENS ARE POPULATED IN ORDER WITHOUT ANY FURTHER
// MANIPULATION, ALLOWS FOR EASY SELECTION BETWEEN UPRIGHT AND REVERSED VERSION OF EACH CARD PULLED FOR 
// A READING (SEE LINE 1944), AND FACILITATES LOOKUP WHEN THE USER DRILLS DOWN TO VIEW AN INDIVIDUAL
// CARD'S DETAILS. 

var aryDeck = [

//=====================MAJOR ARCANA====================

    
                {CardName: "The Fool", 
                 Arcana: "The Major Arcana", 
                 Description: "A young man with a dreamy expression, wearing luxurious clothes, "
                     + "strides toward the edge of a cliff. He seems oblivious to the danger he is in. "
                     + "a dog jumps at his feet, possibly trying to warn him. He has a rose "
                     + "in one hand, and uses the other to carry a hobo pole with all his worldy possessions. ",         
                 Meaning: "You are ready to make changes in your life that others may disagree with, or "
                     + "even feel are foolish. Follow your instincts. ",
                 lgImg: "https://[full path goes here]/large_images/Fool340x340.png", // LIVE FILE PATH IS CONCEALED. 
                 smImg: "https://[full path goes here]/small_images/Fool192x280.png",
                 cardNo: "1"
                },

                {CardName: "The Fool reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A young man with a dreamy expression, wearing luxurious clothes, "
                     + "strides toward the edge of a cliff. He seems oblivious to the danger he is in. "
                     + "A dog jumps at his feet, possibly trying to warn him. He has a rose "
                     + "in one hand, and uses the other to carry a hobo pole with all his worldy possessions. ",         
                 Meaning: "Beware of building castles in the air, and acting on impulse. Now is not the time "
                     + "to leap without looking. ",
                 lgImg: "https://[full path goes here]/large_images/FoolRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FoolRev192x280.png" ,
                 cardNo: "2"   
                },      

                {CardName: "The Magician", 
                 Arcana: "The Major Arcana", 
                 Description: "A youthful figure in the robe of a magician lifts a wand toward the "
                     + "the heavens with one hand and points to the ground with the other, "
                     + "demonstrating his ability to connect the physical and spiritual planes. "
                     + "A table stands in front of him, with symbols of each of the four Tarot suits "
                     + "lying on it. The infinity symbol floats above his head. ",         
                 Meaning: "There is a new beginning, or there are new choices before you. You have all the tools "
                     + "and knowledge you need to make the most of the opportunity, but you must "
                     + "use them correctly. Weigh your options carefully before acting. ",
                 lgImg: "https://[full path goes here]/large_images/Magician340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Magician192x280.png",
                 cardNo: "3" 
                },
                
                {CardName: "The Magician reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A youthful figure in the robe of a magician lifts a wand toward the "
                     + "the heavens with one hand and points to the ground with the other, "
                     + "demonstrating his ability to connect the physical and spiritual planes. "
                     + "A table stands in front of him, with symbols of each of the four Tarot suits "
                     + "lying on it. The infinity symbol floats above his head. ",         
                 Meaning: "Forces are at work that will present you with new opportunities, but you "
                     + "must be patient and wait until the time is right to make a change. ",
                 lgImg: "https://[full path goes here]/large_images/MagicianRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/MagicianRev192x280.png",
                 cardNo: "4"   
                },

                {CardName: "The High Priestess",
                 CardSlotName: "high priestess",
                 Arcana: "The Major Arcana", 
                 Description: "A woman is seated between the white and black pillars of the mystic Temple, "
                     + "surrounded by mystical symbols and holding a book marked Tora. The book is partly covered "
                     + "by her robe to show that some things are implied and some are spoken. ",         
                 Meaning: "The High Priestess represents the inner world, and intuition. Your subconscious is "
                     + "trying to tell you something, but you have been afraid or unwilling to hear it. ",
                 lgImg: "https://[full path goes here]/large_images/HighPriestess340x340.png", 
                 smImg: "https://[full path goes here]/small_images/HighPriestess192x280.png",
                 cardNo: "5"
                },
                
                {CardName: "The High Priestess reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A woman is seated between the white and black pillars of the mystic Temple, "
                     + "surrounded by mystical symbols and holding a book marked Tora. The book is partly covered "
                     + "by her robe to show that some things are implied and some are spoken. ",         
                 Meaning: "Your subconscious is trying to reveal something to you. Turn your attention inward, "
                     + "seek quiet reflection and solitude until the hidden message or path is revealed. ",
                 lgImg: "https://[full path goes here]/large_images/HighPriestessRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/HighPriestessRev192x280.png",
                 cardNo: "6"    
                },

                {CardName: "The Empress", 
                 Arcana: "The Major Arcana", 
                 Description: "A classic, lovely Earth mother figure is seated before a field of ripening corn. "
                     + "She wears a diadem with twelve clustered stars upon it, and a shield with the "
                     + "symbol of Venus rests near her. Water flows from a waterfall in the background and "
                     + "curves in front of her. She holds a scepter topped with a globe. ",         
                 Meaning: "The Empress represents the nurturing and creative feminine force. You currently "
                     + "hold that force in abundance and are ready to share it in the support of others. The "
                     + "card may also indicate a pregnancy or wish for pregnancy. ",
                 lgImg: "https://[full path goes here]/large_images/Empress340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Empress192x280.png",
                 cardNo: "7"  
                },
                
                {CardName: "The Empress reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A classic, lovely Earth mother figure is seated before a field of ripening corn. "
                     + "She wears a diadem with twelve clustered stars upon it, and a shield with the "
                     + "symbol of Venus rests near her. Water flows from a waterfall in the background and "
                     + "curves in front of her. She holds a scepter topped with a globe. ",         
                 Meaning: "You have given too much of yourself to others, and feel both physically and spiritually "
                     + "depleted. Take the time you need to rest and let others step up to take responsibility "
                     + "for a while. ",
                 lgImg: "https://[full path goes here]/large_images/EmpressRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EmpressRev192x280.png",
                 cardNo: "8"    
                },

                {CardName: "The Emperor", 
                 Arcana: "The Major Arcana", 
                 Description: "A commanding, stately, imposing monarch sits on his throne, the very embodiment of "
                      + "order, power, accomplishment and wisdom. ",         
                 Meaning: "The Emperor represents established order and the power of institutions. You may be "
                      + "involved with, or under the control of such an organization, or are seeking to join one. ",
                 lgImg: "https://[full path goes here]/large_images/Emperor340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Emperor192x280.png",
                 cardNo: "9"  
                },
                
                {CardName: "The Emperor reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A commanding, stately, imposing monarch sits upon his throne, the very embodiment of "
                      + "order, power, accomplishment and wisdom. ",         
                 Meaning: "You feel yourself in conflict with the established order or authority. Others may be "
                      + "attempting to force you into a mold of identity or responsibility that does not fit. You "
                      + "are anxious to throw off this yoke, but do not yet have anything meaningful to replace it. ",
                 lgImg: "https://[full path goes here]/large_images/EmperorRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EmperorRev192x280.png",
                 cardNo: "10"    
                },

                {CardName: "The Hierophant", 
                 Arcana: "The Major Arcana", 
                 Description: "Like the High Priestess, the Heirophant is seated between two pillars. He "
                      + "holds a scepter in one hand and raises two fingers heavenward with the other. "
                      + "A crossed pair of keys appears at the base of his seat. Two priestly ministers kneel before him. ",         
                 Meaning: "You are under the influence or guidance of some form of spiritual authority, "
                      + "which may be a church, spiritual movement, or social group. You feel a great deal of "
                      + "loyalty to, and faith in this authority, and may even aspire to a leadership role within it. ",
                 lgImg: "https://[full path goes here]/large_images/Hierophant340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Hierophant192x280.png",
                 cardNo: "11"  
                },
                
                {CardName: "The Hierophant reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "Like the High Priestess, the Heirophant is seated between two pillars. He "
                      + "holds a scepter in one hand and raises two fingers heavenward with the other. "
                      + "A crossed pair of keys appears at the base of his seat. Two priestly ministers kneel before him. ",         
                 Meaning: "After study and careful consideration, you feel ready to break with religious or community "
                      + "traditions and go your own way. Alternatively, you may be just beginning to experience doubts "
                      + "about your faith or identity, and must be willing to challenge old assumptions with courage. ",
                 lgImg: "https://[full path goes here]/large_images/HierophantRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/HierophantRev192x280.png",
                 cardNo: "12"    
                },

                {CardName: "The Lovers", 
                 Arcana: "The Major Arcana", 
                 Description: "The sun shines over the head of an angel floating in the sky above a naked Adam "
                      + "and Eve. The Tree of Life, bearing twelve fruits, stands behind the man. "
                      + "The Tree of the Knowledge of Good and Evil is behind the woman, "
                      + "with the serpent wrapped around it. ",         
                 Meaning: "This card represents cooperative partnership in all forms, not necessarily romantic. "
                      + "You have an opportunity to partner with others toward a common goal. Different "
                      + "but equal options or factors are before you in this enterprise, and you will "
                      + "make the right choice. ",
                 lgImg: "https://[full path goes here]/large_images/Lovers340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Lovers192x280.png",
                 cardNo: "13"  
                },
                
                {CardName: "The Lovers reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "The sun shines over the head of an angel floating in the sky above a naked Adam "
                      + "and Eve. The Tree of Life, bearing twelve fruits, stands behind the man. "
                      + "The Tree of the Knowledge of Good and Evil is behind the woman, "
                      + "with the serpent wrapped around it. ",         
                 Meaning: "Different aspects of yourself that have previously felt contradictory are melding "
                      + "together into a unified whole. You begin to accept and celebrate your multifaceted nature. ",
                 lgImg: "https://[full path goes here]/large_images/LoversRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/LoversRev192x280.png",
                 cardNo: "14"    
                },

                {CardName: "The Chariot", 
                 Arcana: "The Major Arcana", 
                 Description: "A princely figure carrying a drawn sword, riding in a chariot drawn "
                      + "by a black and a white sphinx. Symbols of divination are on his shoulders, "
                      + "and symbols of time adorn his skirt. ",         
                 Meaning: "You are in the zone in bringing a complicated or difficult situation to "
                      + "successful completion. Your forward momentum is now unstoppable, and "
                      + "you are closing in on a win at the finish line. ",
                 lgImg: "https://[full path goes here]/large_images/Chariot340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Chariot192x280.png",
                 cardNo: "15"  
                },
                
                {CardName: "The Chariot reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A princely figure carrying a drawn sword, riding in a chariot drawn "
                      + "by a black and a white sphinx. Symbols of divination are on his shoulders, "
                      + "and symbols of time adorn his skirt. ",         
                 Meaning: "You are feeling internally conflicted, and pulled in different directions. "
                      + "It is a time of transition. Change is inevitable, and you can't fight it. Rather, "
                      + "try to be proactive in weighing the alternatives and making choices. ",
                 lgImg: "https://[full path goes here]/large_images/ChariotRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ChariotRev192x280.png",
                 cardNo: "16"    
                },
                
                {CardName: "Strength", 
                 Arcana: "The Major Arcana", 
                 Description: "A woman with the infinity symbol over her head is closing the jaws of a lion. "
                       + "Her strength of spirit has subdued the lion, which is being led by a chain of flowers. ",         
                 Meaning: "You have been tested and have emerged victorious. You have gained the inner "
                       + "wisdom and strength to control your animal nature and channel its gifts "
                       + "toward positive outcomes. ",
                 lgImg: "https://[full path goes here]/large_images/Strength340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Strength192x280.png",
                 cardNo: "17"  
                },
                
                {CardName: "Strength reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A woman with the infinity symbol over her head is closing the jaws of a lion. "
                       + "Her strength of spirit has subdued the lion, which is being led by a chain of flowers. ",         
                 Meaning: "It is a time of trials and challenges, and you do not feel strong enough to overcome "
                       + "them. Just as fire tempers steel, so too will your own resolve and strength be solidified "
                       + "by these difficult times. ",
                 lgImg: "https://[full path goes here]/large_images/StrengthRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/StrengthRev192x280.png",
                 cardNo: "18"    
                },
                
                {CardName: "The Hermit", 
                 Arcana: "The Major Arcana", 
                 Description: "An elderly, cloaked traveler treads on snow, holding a lit lantern out before him. ",         
                 Meaning: "Someone or something is ready and waiting to guide you, but you refuse to accept this help. "
                       + "Whether out of fear or inertia, you continue to turn away. ",
                 lgImg: "https://[full path goes here]/large_images/Hermit340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Hermit192x280.png",
                 cardNo: "19"  
                },

                {CardName: "The Hermit reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "An elderly, cloaked traveler treads on snow, holding a lit lantern out before him. ",         
                 Meaning: "You have been resisting the call of your inner self and spiritual needs. Stop giving in "
                       + "to distraction, face your fears, and listen to what your subconscious is trying to tell you. ",
                 lgImg: "https://[full path goes here]/large_images/HermitRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/HermitRev192x280.png",
                 cardNo: "20"    
                },    

                {CardName: "The Wheel of Fortune", 
                 Arcana: "The Major Arcana", 
                 Description: "A sphinx is seated upon a wheel in the sky which is inscribed with arcane symbols. "
                      + "The wheel is supported on the back of a jackal headed man, who symbolizes powerful vision. "
                      + "The wheel itself symbolizes the never ending cycle of life and death, and the "
                      + "connection of all living things through karma. In the corners are the winged spirits "
                      + "of a man, an eagle, a bull and a lion, representative of the zodiac signs of Aquarius, "
                      + "Scorpio, Taurus and Leo. All are shown studying books. ",         
                 Meaning: "Forces over which you have no control are now in motion, and all you can do is "
                      + "wait patiently to see how things play out. Do not try to force things, and accept that "
                      + "even if the outcome seems bad at first it is something that needs to happen to "
                      + "prepare you for, or take you to, the next phase of the journey. ",
                 lgImg: "https://[full path goes here]/large_images/WheelOfFortune340x340.png", 
                 smImg: "https://[full path goes here]/small_images/WheelOfFortune192x280.png",
                 cardNo: "21"  
                },
                
                {CardName: "The Wheel of Fortune reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A sphinx is seated upon a wheel in the sky which is inscribed with arcane symbols. "
                      + "The wheel is supported on the back of a jackal headed man, who symbolizes powerful vision. "
                      + "The wheel itself symbolizes the never ending cycle of life and death, and the "
                      + "connection of all living things through karma. In the corners are the winged spirits "
                      + "of a man, an eagle, a bull and a lion, representative of the zodiac signs of Aquarius, "
                      + "Scorpio, Taurus and Leo. All are shown studying books. ",         
                 Meaning: "You are allowing inertia and fear of risk or the unknown to hold you back. Opportunities "
                      + "present themselves, but you are undone by analysis paralysis. Take a chance, and do what "
                      + "you already know is necessary. ",
                 lgImg: "https://[full path goes here]/large_images/WheelOfFortuneRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/WheelOfFortuneRev192x280.png",
                 cardNo: "22"    
                },

                {CardName: "Justice", 
                 Arcana: "The Major Arcana", 
                 Description: "A stoic, robed figure is seated on a raised dais, holding a set of balance "
                      + "scales in one hand and a raised sword in the other. ",         
                 Meaning: "You may be involved in an actual legal matter, or seeking justice in the figurative "
                      + "sense. It is important to seek an outcome that's fair and balances the interests "
                      + "of all parties to the matter. Attempts to manipulate things toward personal advantage "
                      + "will backfire. ",
                 lgImg: "https://[full path goes here]/large_images/Justice340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Justice192x280.png",
                 cardNo: "23"   
                },
                
                {CardName: "Justice reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A stoic, robed figure is seated on a raised dais, holding a set of balance "
                      + "scales in one hand and a raised sword in the other. ",         
                 Meaning: "Injustice, or a negative outcome in a legal, financial or business matter. You may feel "
                      + "justified in your resentment over being treated unfairly, but do not let it fester. Regroup "
                      + "and move on as soon as you are ready. ",
                 lgImg: "https://[full path goes here]/large_images/JusticeRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/JusticeRev192x280.png",
                 cardNo: "24"    
                },

                {CardName: "The Hanged Man", 
                 Arcana: "The Major Arcana", 
                 Description: "A man is suspended upside down from a frame consisting of a vertical wooden post "
                      + "crossed at the top by a horizontal wooden post. There is a halo of light about the head "
                      + "of the hanged man. The tree of sacrifice is living wood, with leaves showing. The face "
                      + "of the hanged man expresses deep entrancement, not suffering. The figure suggests life "
                      + "in suspension or contemplation. ",         
                 Meaning: "You have reached a crossroads in life, either materially or spiritually. Do not rush "
                      + "this decision. Take time for quiet introspection and consider all possibilities, "
                      + "even those you might never have entertained before. Listen to your inner voice, and "
                      + "be prepared to make sacrifices in order to pursue the correct path. ",
                 lgImg: "https://[full path goes here]/large_images/HangedMan340x340.png", 
                 smImg: "https://[full path goes here]/small_images/HangedMan192x280.png",
                 cardNo: "25"   
                },

                {CardName: "The Hanged Man reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A man is suspended upside down from a frame consisting of a vertical wooden post "
                      + "crossed at the top by a horizontal wooden post. There is a halo of light about the head "
                      + "of the hanged man. The tree of sacrifice is living wood, with leaves showing. The face "
                      + "of the hanged man expresses deep entrancement, not suffering. The figure suggests life "
                      + "in suspension or contemplation. ",         
                 Meaning: "You are too focused on material and physical things. Your current attitude is cynical, shallow "
                      + "and self centered. Introspection and attitude adjustment are needed in order "
                      + "to continue your spiritual growth. ",
                 lgImg: "https://[full path goes here]/large_images/HangedManRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/HangedManRev192x280.png",
                 cardNo: "26"   
                },
    
                {CardName: "Death", 
                 Arcana: "The Major Arcana", 
                 Description: "A mounted, armored knight bears a black banner emblazoned with a "
                      + "white rose that symbolizes pure, faithful love. The sun of immortality shines between "
                      + "two pillars on the horizon, rising over a body of water that symbolizes the unconscious. "
                      + "A king, child and maiden fall before the knight, and a priest raises clasped hands. ",         
                 Meaning: "This card does not generally symbolize death in the literal sense, but the end of "
                      + "one cycle or phase of life and the beginning of another. You are experiencing disruptive "
                      + "changes in life. You must allow the old ways, plans and expectations to die before you can be reborn "
                      + "into the new path and reap its benefits. ",
                 lgImg: "https://[full path goes here]/large_images/Death340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Death192x280.png",
                 cardNo: "27"    
                },
                
                {CardName: "Death reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A mounted, armored knight bears a black banner emblazoned with a "
                      + "white rose that symbolizes pure, faithful love. The sun of immortality shines between "
                      + "two pillars on the horizon, rising over a body of water that symbolizes the unconscious. "
                      + "A king, child and maiden fall before the knight, and a priest raises clasped hands. ",         
                 Meaning: "You are avoiding making necessary changes, such as changing jobs or ending a toxic relationship, "
                      + "because you fear the unknown that will follow. Destructive patterns and habits die hard, but "
                      + "you cannot move forward until they do. ",
                 lgImg: "https://[full path goes here]/large_images/DeathRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/DeathRev192x280.png",
                 cardNo: "28"    
                },

                {CardName: "Temperance", 
                 Arcana: "The Major Arcana", 
                 Description: "A winged angel with the sign of the sun upon its forehead pours the essences of "
                      + "life from chalice to chalice in each of its hands. It has one foot upon the earth and "
                      + "one in the water. A direct path goes up to the horizon, and above there is a great "
                      + "light containing the outline of a crown. ",         
                 Meaning: "You are feeling pulled in different directions, or by different priorities. Now is the "
                      + "time to seek balance. Be patient and realistic to achieve both inner peace and "
                      + "outer balance. Do not let ego prevent a positive outcome. ",
                 lgImg: "https://[full path goes here]/large_images/Temperance340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Temperance192x280.png",
                 cardNo: "29"    
                },
                
                {CardName: "Temperance reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A winged angel, with the sign of the sun upon its forehead and the square and "
                      + "triangle of the septenary on its breast, stands on a shore. It pours the essences of "
                      + "life from chalice to chalice in each of its hands. It has one foot upon the earth and "
                      + "one in the water. A direct path goes up to the horizon, and above there is a great "
                      + "light containing the outline of a crown. ",         
                 Meaning: "You feel stuck and powerless to get things moving again. Accept that the situation is "
                      + "currently beyond your control. All you can do is wait for things to play out, and in the "
                      + "meantime concentrate on doing what you can to balance the opposing forces within yourself. ",
                 lgImg: "https://[full path goes here]/large_images/TemperanceRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TemperanceRev192x280.png",
                 cardNo: "30"    
                },

                {CardName: "The Devil", 
                 Arcana: "The Major Arcana", 
                 Description: "A winged, humanoid, horned goat with a reversed pentagram on its forehead stands "
                      + "on an altar. In a dark echo of the Magician card its right hand is upraised, and in its "
                      + "left it holds a large flaming torch, inverted towards the earth. "
                      + "Male and female figures representing Adam and Eve after the fall are chained to a ring "
                      + "at the front of the altar. The figures have tails, to signify an animal nature, but "
                      + "there is human intelligence in the faces. The horned goat will not be their master "
                      + "forever, only a temporary keeper. ",         
                 Meaning: "This card represents negative, self destructive instincts and drives within yourself. "
                      + "You are allowing selfish, base impulses to keep you imprisoned and undo any progress you have made. "
                      + "Stop blaming others, or exterior obstacles. Only you have the power to stop this destructive cycle. ",
                 lgImg: "https://[full path goes here]/large_images/Devil340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Devil192x280.png",
                 cardNo: "31"    
                },
                
                {CardName: "The Devil reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A winged, humanoid, horned goat with a reversed pentagram on its forehead stands "
                      + "on an altar. In a dark echo of the Magician card, its right hand is upraised and extended "
                      + "and it holds a large flaming torch, inverted towards the earth, in its left hand. "
                      + "Male and female figures representing Adam and Eve after the fall are chained to a ring "
                      + "at the front of the altar. The figures have tails, to signify an animal nature, but "
                      + "there is human intelligence in the faces. The horned goat will not be their master "
                      + "forever, only a temporary keeper. ",         
                 Meaning: "You feel trapped by outside forces, but in reality you are the one holding yourself back. "
                      + "The path to freedom is hard and you fear it. The only way out is through. Face your fears "
                      + "and do the work. ",
                 lgImg: "https://[full path goes here]/large_images/DevilRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/DevilRev192x280.png",
                 cardNo: "32"    
                },

                {CardName: "The Tower", 
                 Arcana: "The Major Arcana", 
                 Description: "In a dark nighttime scene, a male and female figure fall from a tower that has been "
                      + "struck by lightning and has caught fire. A crown at the top of the tower has been thrown "
                      + "off by the lightning strike. ",         
                 Meaning: "Disruption, pain and hardship are coming, but they are necessary for your personal growth "
                      + "and to make way for better things. "
                      + "The disaster is inevitable, and trying "
                      + "to avoid the truth will only make things worse. Face the crisis head on, and know "
                      + "you will come out the stronger for it. ",
                 lgImg: "https://[full path goes here]/large_images/Tower340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Tower192x280.png",
                 cardNo: "33"    
                },
                
                {CardName: "The Tower reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "In a dark nighttime scene, a male and female figure fall from a tower that has been "
                      + "struck by lightning and has caught fire. A crown at the top of the tower has been thrown "
                      + "off by the lightning strike. ",         
                 Meaning: "You are bringing unnecessary hardships and pain upon yourself by refusing to face the "
                      + "hard realities of the situation. ",
                 lgImg: "https://[full path goes here]/large_images/TowerRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TowerRev192x280.png",
                 cardNo: "34"    
                },

                {CardName: "The Star", 
                 Arcana: "The Major Arcana", 
                 Description: "A naked female figure kneels on a shoreline with her right foot upon the water. "
                      + "She pours the water of life from two great pitchers, irrigating sea and land. Above her is a"
                      + "great, radiant star of eight rays, surrounded by seven lesser stars, each of which "
                      + "also has eight rays. Behind her is rising ground and on the right a shrub or tree where "
                      + "a bird is perched. ",         
                 Meaning: "You have learned to accept what life brings without fear or resentment, and are "
                      + "fully in tune with the rhythms of your inner and outer world. Your trust in yourself "
                      + "and the universe brings new opportunities for love, growth or material gain, "
                      + "and you are ready to reap the benefits of your spiritual awakening. ",
                 lgImg: "https://[full path goes here]/large_images/Star340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Star192x280.png",
                 cardNo: "35"    
                },
                
                {CardName: "The Star reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A naked female figure kneels on a shoreline with her right foot upon the water. "
                      + "She pours the water of life from two great pitchers, irrigating sea and land. Above her is a"
                      + "great, radiant star of eight rays, surrounded by seven lesser stars, each of which "
                      + "also has eight rays. Behind her is rising ground and on the right a shrub or tree where "
                      + "a bird is perched. ",         
                 Meaning: "Disappointment or failure have led to withdrawal. Welcome this period of solitude, and "
                      + "the opportunity it presents to rest, reflect and rebuild your spiritual resources. ",
                 lgImg: "https://[full path goes here]/large_images/StarRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/StarRev192x280.png",
                 cardNo: "36"    
                },

                {CardName: "The Moon", 
                 Arcana: "The Major Arcana", 
                 Description: "A dog and wolf stand on either side of a path, barking at the full moon. The path leads "
                       + "to the horizon, passing between two distant towers. In the foreground, a lobster rises from "
                       + "the water and crawls onto the shore. ",         
                 Meaning: "It is a time of inner awakening. You are becoming more sensitive to your intuition and more "
                       + "trusting of your instincts. Pay attention to what your subconscious is trying to tell you "
                       + "through your dreams and gut feelings. ",
                 lgImg: "https://[full path goes here]/large_images/Moon340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Moon192x280.png",
                 cardNo: "37"    
                },
                
                {CardName: "The Moon reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A dog and wolf stand on either side of a path, barking at the full moon. The path leads "
                       + "to the horizon, passing between two distant towers. In the foreground, a lobster rises from "
                       + "the water and crawls onto the shore. ",         
                 Meaning: "The demands of the material world are consuming your energies and attentions, and your "
                       + "soul is suffering. You need to take some time out for yourself, to recharge your spiritual batteries. ",
                 lgImg: "https://[full path goes here]/large_images/MoonRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/MoonRev192x280.png",
                 cardNo: "38"    
                },

                {CardName: "The Sun", 
                 Arcana: "The Major Arcana", 
                 Description: "A smiling, naked child mounted on a white horse holds a large red flag. "
                       + "A field of blooming sunflowers can be seen on the other side of a wall behind the child. "
                       + "The sun shines brightly above the scene. ",         
                 Meaning: "It is a time of great optimism, energy and available resources of every kind in your life. "
                       + "Whatever form your new beginning takes, success is assured and the outcome will be positive. ",
                 lgImg: "https://[full path goes here]/large_images/Sun340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Sun192x280.png",
                 cardNo: "39"    
                },
                
                {CardName: "The Sun reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "A smiling, naked child mounted on a white horse holds a large red flag. "
                       + "A field of blooming sunflowers can be seen on the other side of a wall behind the child. "
                       + "The sun shines brightly above the scene. ",         
                 Meaning: "This is still a very positive card, even in the reversed position. There may be delays or "
                       + "minor complications as you start down a new path, but these will not last. Whatever form your "
                       + "new beginning takes, success is assured and the outcome will be positive. ",
                 lgImg: "https://[full path goes here]/large_images/SunRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SunRev192x280.png",
                 cardNo: "40"    
                },


                {CardName: "Judgement", 
                 Arcana: "The Major Arcana", 
                 Description: "Spirits of the dead arise from their graves on judgement day. An angel floats "
                        + "in the clouds above them, blowing a trumpet to call them to attention. ",         
                 Meaning: "You have achieved a higher level of experience and maturity. You are now ready to step "
                        + "confidently into the next phase of your life, or the next project you undertake, "
                        + "and can trust in your judgement to successfully navigate any obstacles that await. ",
                 lgImg: "https://[full path goes here]/large_images/Judgement340x340.png", 
                 smImg: "https://[full path goes here]/small_images/Judgement192x280.png",
                 cardNo: "41"    
                },
                
                {CardName: "Judgement reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "Spirits of the dead arise from their graves on judgement day. An angel floats "
                        + "in the clouds above them, blowing a trumpet to call them to attention. ",         
                 Meaning: "Frustrating delays and obstacles are tempting you to give in to childish impulses. "
                        + "Resist urges that drive you to weakness. Do the right, and adult thing. ",
                 lgImg: "https://[full path goes here]/large_images/JudgementRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/JudgementRev192x280.png",
                 cardNo: "42"    
                },

                {CardName: "The World", 
                 Arcana: "The Major Arcana", 
                 Description: "Against an expanse of blue sky a naked, triumphant female figure is surrounded "
                        + "by a green wreath, holding a wand in each hand. At each of the four corners are an "
                        + "angel, an eagle, a bull and a lion. ",         
                 Meaning: "You have brought the current phase of your life to completion, balancing the "
                        + "material with the spiritual, gaining wisdom and life skills. Things are falling "
                        + "into place in every area of your life, and the choices you are making are the "
                        + "right ones. Success is assured, whatever you choose to do next. ",
                 lgImg: "https://[full path goes here]/large_images/World340x340.png", 
                 smImg: "https://[full path goes here]/small_images/World192x280.png",
                 cardNo: "43"    
                },
                
                {CardName: "The World reversed", 
                 Arcana: "The Major Arcana", 
                 Description: "Against an expanse of blue sky a naked, triumphant female figure is surrounded "
                        + "by a green wreath, holding a wand in each hand. At each of the four corners are an "
                        + "angel, an eagle, a bull and a lion. ",         
                 Meaning: "You are feeling overwhelmed by the complexities of the world and life. You begin to "
                        + "realize that every choice has consequences for good or bad, and you feel a greater "
                        + "weight of responsibility and indecision as a result. Do not let this expanded "
                        + "worldview paralyze you. See it as a learning and growth opportunity. ",
                 lgImg: "https://[full path goes here]/large_images/WorldRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/WorldRev192x280.png",
                 cardNo: "44"    
                },
                
//==========WANDS===============================================================                
                

                {CardName: "King of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A seated king lifts a sprouting wand. The lion emblazoned on the back of "
                      + "his throne symbolizes natural courage and strength, and purity of purpose. ",         
                 Meaning: "The king may represent an older, honest and trustworthy man you may rely upon. "
                      + "Otherwise, it means there are no hidden factors or "
                      + "ulterior motives at work in the situation at hand. "
                      + "An unexpected benefit in the form of helpful advice, a new work "
                      + "opportunity, or a gift or inheritance is coming. ",
                 lgImg: "https://[full path goes here]/large_images/KingWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingWands192x280.png",
                 cardNo: "45"   
                },
                    
                {CardName: "King of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A seated king lifts a sprouting wand. The lion emblazoned on the back of "
                      + "his throne symbolizes natural courage and strength, and purity of purpose. ",         
                 Meaning: "You can expect minor delays or complications in your creative or business "
                      + "endeavors, but all will eventually be set right again. ",
                 lgImg: "https://[full path goes here]/large_images/KingWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingWandsRev192x280.png",
                 cardNo: "46"   
                },
                    
                {CardName: "Queen of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A stately, wise, and simply clad queen holds court from her throne with a "
                      + "sprouting wand in her right hand. Lions decorate her throne, and a black cat sits "
                      + "at her feet. ",         
                 Meaning: "The queen may represent an older, honest and kindly disposed woman you can rely upon "
                      + "as a mentor or partner. Otherwise, this card signifies the time is right for you to "
                      + "launch a new creative or business endeavor . ",
                 lgImg: "https://[full path goes here]/large_images/QueenWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenWands192x280.png",
                 cardNo: "47"   
                },
                    
                {CardName: "Queen of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A stately, wise, and simply clad queen holds court from her throne with a "
                      + "sprouting wand in her right hand. Lions decorate her throne, and a black cat sits "
                      + "at her feet. ",         
                 Meaning: "A woman who wishes to use her status, wealth or knowledge to control you. ",
                 lgImg: "https://[full path goes here]/large_images/QueenWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenWandsRev192x280.png",
                 cardNo: "48"   
                },
                    
                {CardName: "The Knight of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A young knight on a rearing horse whose highly decorated armor seems more "
                      + "for show than doing battle. He holds a sprouting wand in one hand, and seems poised to "
                      + "rush into competition. ",         
                 Meaning: "This knight comes bearing good news for your personal or professional life. He may "
                      + "represent an honest, trustworthy friend, coworker or advisor who will be the one to share "
                      + "the good news. ",
                 lgImg: "https://[full path goes here]/large_images/KnightWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightWands192x280.png",
                 cardNo: "49"   
                },        

                {CardName: "The Knight of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A young knight on a rearing horse whose highly decorated armor seems more "
                      + "for show than doing battle. He holds a sprouting wand in one hand, and seems poised to "
                      + "rush into competition. ",         
                 Meaning: "Reversed, this card foretells delayed travel, communication, or meetings. ",
                 lgImg: "https://[full path goes here]/large_images/KnightWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightWandsRev192x280.png",
                 cardNo: "50"   
                },
                    
                {CardName: "The Page of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "a young man stands in the act of proclamation. He is unknown but faithful, "
                      + "and brings important news. ",         
                 Meaning: "The page brings helpful information you can apply in your personal or professional "
                      + "life. He may represent someone in your life who is young and adventurous, "
                      + "yet honest and trustworthy. ",
                 lgImg: "https://[full path goes here]/large_images/PageWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PageWands192x280.png",
                 cardNo: "51"   
                },       

                {CardName: "The Page of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A young man stands in the act of proclamation. He is unknown but faithful, "
                      + "and brings important news. ",         
                 Meaning: "The page brings news of a cancellation, delay or mistake that can have serious consquences. ",
                 lgImg: "https://[full path goes here]/large_images/PageWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PageWandsRev192x280.png",
                 cardNo: "52"   
                },
                    
                {CardName: "Ace of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A hand issuing from a cloud grasps a sprouting wand. ",         
                 Meaning: "You are at the start of a new professional or creative project and are "
                      + "ready to invest in it fully. ",
                 lgImg: "https://[full path goes here]/large_images/AceWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AceWands192x280.png",
                 cardNo: "53"   
                },    
        
                {CardName: "Ace of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A hand issuing from a cloud grasps a sprouting wand. ",         
                 Meaning: "Forces to effect change have been set in motion, but things are moving more slowly "
                      + "than you would like. ",
                 lgImg: "https://[full path goes here]/large_images/AceWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AceWandsRev192x280.png",
                 cardNo: "54"   
                },

                {CardName: "Two of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A tall man looks from a battlement roof over sea and shore. He holds "
                      + "a globe in his right hand, and a sprouting wand in his left. A second sprouting "
                      + "wand stands in a ring at his side. ",         
                 Meaning: "You have launched a new creative or professional project, but are experiencing "
                      + "unforeseen factors, obstacles or delays. It may be necessary to change "
                      + "direction, or revisit your original plans or schedule. ",
                 lgImg: "https://[full path goes here]/large_images/TwoWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoWands192x280.png",
                 cardNo: "55"   
                },    
                    
                {CardName: "Two of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A tall man looks from a battlemented roof over sea and shore. He holds "
                      + "a globe in his right hand, and a sprouting wand in his left. A second sprouting "
                      + "wand stands in a ring at his side. ",         
                 Meaning: "A surprise is coming. Whether it will be for good or bad depends on whether the other "
                      + "cards in the spread are positive or negative. In a single card reading the outcome is unclear. ",
                 lgImg: "https://[full path goes here]/large_images/TwoWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoWandsRev192x280.png",
                 cardNo: "56"   
                },

                {CardName: "Three of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A calm, stately man standing on a cliff edge watches for ships at sea. " 
                      + "Three sprouting wands are planted in the ground, and he grasps one of them. "
                      + "He holds a globe in his other hand. ",         
                 Meaning: "You are in the early stages of a new creative or professional endeavor, and have "
                      + "succeeded in overcoming early challenges. You now feel firmly in control of the "
                      + "situation, and can expect help and cooperation from others. ",
                 lgImg: "https://[full path goes here]/large_images/ThreeWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreeWands192x280.png",
                 cardNo: "57"   
                },
        
                {CardName: "Three of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A calm, stately man standing on a cliff edge watches for ships at sea. " 
                      + "Three sprouting wands are planted in the ground, and he grasps one of them. "
                      + "He holds a globe in his other hand. ",         
                 Meaning: "A period of private reflection and planning has come to a close, and you are now "
                      + "prepared to return to your project or issue with greater clarity and purpose. ",
                 lgImg: "https://[full path goes here]/large_images/ThreeWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreeWandsRev192x280.png",
                 cardNo: "58"   
                },
                    
                {CardName: "Four of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A garland of colorful flowers is suspended from four flowering wands. Two female "
                      + "figures lift bouquets. At their side is a bridge over a moat, leading to a manor house. ",        
                 Meaning: "You have succeeded in the establishment of a new professional or creative undertaking, "
                      + "and can now expect to enjoy financial, material and other rewards from your efforts. ",
                 lgImg: "https://[full path goes here]/large_images/FourWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourWands192x280.png",
                 cardNo: "59"   
                },    

                {CardName: "Four of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A garland of colorful flowers is suspended from four flowering wands. Two female "
                      + "figures lift bouquets. At their side is a bridge over a moat, leading to a manor house. ",        
                 Meaning: "You are enjoying the fruits of your success, but on a private or modest level. Things are "
                      + "going well, but you feel no need to trumpet your win from the mountaintops. ",
                 lgImg: "https://[full path goes here]/large_images/FourWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourWandsRev192x280.png",
                 cardNo: "60"   
                },

                {CardName: "Five of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A group of young men brandish sprouting wands, in sport or playing at war. ",         
                 Meaning: "This card represents struggle and competition in professional or social situations. "
                      + "The playing field has changed. New people or elements must be factored into your "
                      + "plans. If other cards in the reading are favorable you will succeed. If other cards "
                      + "are negative there will be setbacks. In a single card reading the outcome is unclear. ",
                 lgImg: "https://[full path goes here]/large_images/FiveWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FiveWands192x280.png",
                 cardNo: "61"   
                },    
                    
                {CardName: "Five of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A group of young men brandish sprouting wands, in sport or playing at war. ",         
                 Meaning: "Dishonest or ruthless players have entered into competition with you. Be careful "
                      + "in forming new alliances, and alert to underhanded tactics. ",
                 lgImg: "https://[full path goes here]/large_images/FiveWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FiveWandsRev192x280.png",
                 cardNo: "62"   
                },
                    
                 {CardName: "Six of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A horseman rides victorious, to the encouragement of others on the ground. ",         
                 Meaning: "You have overcome past challenges and gained the self confidence you need to assure "
                      + "victory. Enjoy the rewards you have rightfully earned, and the respect and recognition "
                      + "that are coming your way. ",
                 lgImg: "https://[full path goes here]/large_images/SixWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixWands192x280.png",
                 cardNo: "63"   
                },    

                {CardName: "Six of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A horseman rides victorious, to the encouragement of others on the ground. ",         
                 Meaning: "Your success is delayed by factors beyond your control. You are feeling metaphorically "
                      + "challenged to a fight, either by betrayal or public humiliation. ",
                 lgImg: "https://[full path goes here]/large_images/SixWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixWandsRev192x280.png",
                 cardNo: "64"   
                },
                    
                {CardName: "Seven of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A young man defends his position on the higher ground from six challengers below. ",         
                 Meaning: "Your willingness to fight for what you believe in, and to protect what you have "
                      + "accomplished, will see you through to victory. Stay the course, and you will succeed. ",
                 lgImg: "https://[full path goes here]/large_images/SevenWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SevenWands192x280.png",
                 cardNo: "65"   
                },    

                {CardName: "Seven of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A young man defends his position on the higher ground from six challengers below. ",         
                 Meaning: "You are feeling confused, and uncertain which choice to make or which path to follow. "
                      + "It is important to make a decision and commit to it, as remaining on the fence will "
                      + "make the situation worse. ",
                 lgImg: "https://[full path goes here]/large_images/SevenWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SevenWandsRev192x280.png",
                 cardNo: "66"   
                },
                    
                {CardName: "Eight of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "Eight sprouting wands sail rapidly through the air toward their target. ",         
                 Meaning: "Things are rapidly coming to a successful close. Start making plans toward your "
                      + "next goal, or laying the groundwork for the next phase of the project. Demands on "
                      + "your time and energy are high, but you are in control and can make good things happen. ",
                 lgImg: "https://[full path goes here]/large_images/EightWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightWands192x280.png",
                 cardNo: "67"   
                },
                    
                {CardName: "Eight of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "Eight sprouting wands sail rapidly through the air toward their target. ",         
                 Meaning: "You are being forced or pressured into a change you do not want, either in your work "
                      + "or personal life. Resolve to accept it, even if you do not feel ready. There will be "
                      + "new demands on your time, energy and attention. Try not to neglect important relationships. ",
                 lgImg: "https://[full path goes here]/large_images/EightWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightWandsRev192x280.png",
                 cardNo: "68"   
                },
                    
                {CardName: "Nine of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "An embattled man leans upon his staff and watches for threats. Behind "
                      + "him are eight other wands arrayed in the ground like a fence.",         
                 Meaning: "The battle is over and you have prevailed. Should any further challenges arise, "
                      + "you will see them coming and are ready to face them head on. ",
                 lgImg: "https://[full path goes here]/large_images/NineWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NineWands192x280.png",
                 cardNo: "69"   
                },

                {CardName: "Nine of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "An embattled man leans upon his staff and watches for threats. Behind him "
                      + "are eight other wands arrayed in the ground like a fence.",         
                 Meaning: "You continue to fight for a lost cause, or impossible goal. Accept defeat and "
                      + "learn what you can from it. These lessons will prepare you for the next challenge. ",
                 lgImg: "https://[full path goes here]/large_images/NineWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NineWandsRev192x280.png",
                 cardNo: "70"   
                },

                {CardName: "Ten of Wands", 
                 Arcana: "The Suit of Wands", 
                 Description: "A man carries a heavy bundle of ten sprouting wands. ",         
                 Meaning: "You feel as if you have been carrying the weight of the world, and "
                      + "need to lay the burden down. If others haven't been doing their fair share "
                      + "it is time for you to ask them to step up and take responsibility. This card "
                      + "can also signify an unwillingness to ask for needed help. ",
                 lgImg: "https://[full path goes here]/large_images/TenWands340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenWands192x280.png",
                 cardNo: "71"   
                },
                    
                {CardName: "Ten of Wands reversed", 
                 Arcana: "The Suit of Wands", 
                 Description: "A man carries a heavy bundle of ten sprouting wands. ",         
                 Meaning: "You are learning when to say no, and how to delegate more effectively. A "
                      + "weight has been lifted and your stress levels are down. Conversely, if other cards "
                      + "in the reading are negative, this one may signify your health or emotional "
                      + "state is suffering from excessive demands and stress. ",
                 lgImg: "https://[full path goes here]/large_images/TenWandsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenWandsRev192x280.png",
                 cardNo: "72"   
                },

//===================CUPS=============================================


                {CardName: "King of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A king wearing unadorned robes is seated on a throne that sits upon "
                      + "a platform on the sea. The background shows a sailing ship to one side "
                      + "and a leaping dolphin opposite. ",         
                 Meaning: "A loving and kind father figure on whom you can depend. If not an actual "
                      + "person, the king represents a favorable situation, most likely involving art "
                      + "or creativity. ",
                 lgImg: "https://[full path goes here]/large_images/KingCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingCups192x280.png",
                 cardNo: "73"   
                },
                    
                {CardName: "King of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A king wearing unadorned robes is seated on a throne that sits upon "
                      + "a platform on the sea. The background shows a sailing ship to one side "
                      + "and a leaping dolphin opposite. ",         
                 Meaning: "It is time to move on from a love or mentoring relationship, possibly "
                      + "involving an older man. The split will be amicable. ",
                 lgImg: "https://[full path goes here]/large_images/KingCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingCupsRev192x280.png",
                 cardNo: "74"   
                },
                    
                {CardName: "Queen of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "The beautiful and honorable wife of the king, also seated on a throne with water "
                      + "at her feet. ",         
                 Meaning: "A creative, kind woman with strong intuition who can provide assistance and "
                      + "good counsel. If not an actual person, the queen represents a creative project "
                      + "with associated good feelings. ",
                 lgImg: "https://[full path goes here]/large_images/QueenCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenCups192x280.png",
                 cardNo: "75"   
                },

                {CardName: "Queen of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "The beautiful and honorable wife of the king, also seated on a throne with water "
                      + "at her feet. ",         
                 Meaning: "Beware of advice from someone who does not have your best interests at heart. "
                      + "Do not offer your trust lightly. A romance or friendship may be coming to an end. "
                      + "Do not toy with emotions or play games. Honesty will serve you better. ",
                 lgImg: "https://[full path goes here]/large_images/QueenCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenCupsRev192x280.png",
                 cardNo: "76"   
                },
                    
                {CardName: "The Knight of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A graceful armored knight rides in stately procession. His role here "
                       + "is ceremonial and romantic in the classical sense, not military. ",         
                 Meaning: "This knight brings glad tidings, often concerning matters of the heart. The "
                       + "knight may represent a real life suitor or loving friend. ",
                 lgImg: "https://[full path goes here]/large_images/KnightCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightCups192x280.png",
                 cardNo: "77"   
                },

                {CardName: "The Knight of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A graceful, armored knight rides in stately procession. His role here "
                       + "is ceremonial and romantic in the classical sense, not military. ",         
                 Meaning: "The object of your affection does not feel the same about you. You may be "
                       + "waiting for a sign, message or commitment that will never come. You have "
                       + "been misled, or have allowed yourself to be taken advantage of. ",
                 lgImg: "https://[full path goes here]/large_images/KnightCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightCupsRev192x280.png",
                 cardNo: "78"   
                },
                    
                {CardName: "The Page of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A young man in rich garb holds a chalice with a fish peeking out of it. ",         
                 Meaning: "A young person bearing news concerning love or relationships. You will face some "
                       + "risk in the matter, but have already decided you are willing to take a chance. ",
                 lgImg: "https://[full path goes here]/large_images/PageCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PageCups192x280.png",
                 cardNo: "79"   
                },
    
                {CardName: "The Page of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A young man in rich garb holds a chalice with a fish peeking out of it. ",         
                 Meaning: "Beware of romantic games and sketchy people. Either you or the other person "
                       + "is playing false. Either way, it will end badly if you allow it to continue. ",
                 lgImg: "https://[full path goes here]/large_images/PageCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PageCupsRev192x280.png",
                 cardNo: "80"   
                },
                    
                 {CardName: "Ace of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A chalice emerges from a cloud, with waters flowing from it like a fountain. "
                      + "Above, a dove of peace grasps a host wafer. ",         
                 Meaning: "The beginning of a longed for love or relationship is at hand. New feelings awake. ",
                 lgImg: "https://[full path goes here]/large_images/AceCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AceCups192x280.png",
                 cardNo: "81"   
                },   

                {CardName: "Ace of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A chalice emerges from a cloud, with waters flowing from it like a fountain. "
                      + "Above, a dove of peace grasps a host wafer. ",         
                 Meaning: "A new project, partnership, business or romance seems stalled by delays and obstacles. "
                      + "It may be a case of bad timing. ",
                 lgImg: "https://[full path goes here]/large_images/AceCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AceCupsRev192x280.png",
                 cardNo: "82"   
                },

                {CardName: "Two of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A young couple bearing cups pledge their love to one another. The figure of a "
                      + "winged lion head floats in the air above. ",         
                 Meaning: "A harmonious partnership or union, whether romantic, friendly, familial or professional. ",
                 lgImg: "https://[full path goes here]/large_images/TwoCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoCups192x280.png",
                 cardNo: "83"   
                },    
                       
                {CardName: "Two of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A young couple bearing cups pledge their love to one another. The figure of a "
                      + "winged lion head floats in the air above. ",         
                 Meaning: "The meaning of this card when reversed is not much different than when it appears "
                      + "upright. It signifies a harmonious partnership or union, whether romantic, friendly, "
                      + "familial or professional, though there may be a secretive or limiting aspect. ",
                 lgImg: "https://[full path goes here]/large_images/TwoCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoCupsRev192x280.png",
                 cardNo: "84"   
                },
                    
                {CardName: "Three of Cups",
                 Arcana: "The Suit of Cups", 
                 Description: "Three maidens frolic joyfully in a garden with cups upraised. ",         
                 Meaning: "A successful completion, a time of celebration and joy. ",
                 lgImg: "https://[full path goes here]/large_images/ThreeCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreeCups192x280.png",
                 cardNo: "85"   
                },                      

                {CardName: "Three of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "Three maidens frolic joyfully in a garden with cups upraised. ",         
                 Meaning: "Your successes and rewards may be small or fleeting at present, but you "
                      + "should enjoy them nonetheless. ",
                 lgImg: "https://[full path goes here]/large_images/ThreeCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreeCupsRev192x280.png",
                 cardNo: "86"   
                },
                    
                {CardName: "Four of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A disinterested young man sits beneath a tree with three cups before him, "
                      + "and a fourth is offered by a disembodied hand in the sky. ",         
                 Meaning: "It is a time of withdrawal and apathy, maybe even ennui or depression. Your energies "
                      + "have hit a low. Take time to rest and regroup. ",
                 lgImg: "https://[full path goes here]/large_images/FourCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourCups192x280.png",
                 cardNo: "87"   
                },       

                {CardName: "Four of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A disinterested young man sits beneath a tree with three cups before him, "
                      + "and a fourth is offered by a disembodied hand in the sky. ",         
                 Meaning: "You are unhappy in a relationship or creative endeavor. This is a good time to "
                      + "step back and reflect on what you really want, and how to proceed. ",
                 lgImg: "https://[full path goes here]/large_images/FourCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourCupsRev192x280.png",
                 cardNo: "88"   
                },
                    
                 {CardName: "Five of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A dark, cloaked figure hangs his head as he gazes upon the five cups at his feet. "
                      + "Three of the cups are overturned. A bridge in the background leads to a small keep. ",         
                 Meaning: "You are feeling deep regret and preoccupation with past mistakes. The road to the future "
                      + "awaits, but you must let go of the past before you can move forward. ",
                 lgImg: "https://[full path goes here]/large_images/FiveCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FiveCups192x280.png",
                 cardNo: "89"   
                },    
                    
                {CardName: "Five of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A dark, cloaked figure hangs his head as he gazes on the five cups at his feet. "
                      + "Three of the cups are overturned. A bridge in the background leads to a small keep. ",         
                 Meaning: "You are allowing your negative outlook to color everything you see, and hold you back. "
                      + "If you want things to change, you must first change your attitude. ",
                 lgImg: "https://[full path goes here]/large_images/FiveCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FiveCupsRev192x280.png",
                 cardNo: "90"   
                },

                {CardName: "Six of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "Two children in a rustic garden, together with five cups that hold flowers. ",         
                 Meaning: "Nostalgia and pleasant memories of the past can inform current decisions. Sort through "
                      + "past events to put them into perspective, and the right way forward will reveal itself. ",
                 lgImg: "https://[full path goes here]/large_images/SixCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixCups192x280.png",
                 cardNo: "91"   
                },       
                    
                {CardName: "Six of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "Two children in a rustic garden, together with five cups that hold flowers. ",         
                 Meaning: "The situation is changing for the better, in a way that makes you feel more stable "
                      + "and secure. New people or opportunities are coming your way, and you are now "
                      + "emotionally prepared to ensure a positive outcome. ",
                 lgImg: "https://[full path goes here]/large_images/SixCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixCupsRev192x280.png",
                 cardNo: "92"   
                },
                    
                {CardName: "Seven of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A plethora of fantastical and mysterious options are presented in seven floating chalices. ",         
                 Meaning: "You are overwhelmed with options that all seem exciting, but beware of deceptive appearances. "
                      + "The correct choice may be to choose nothing at all for the time being. ",
                 lgImg: "https://[full path goes here]/large_images/SevenCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SevenCups192x280.png",
                 cardNo: "93"   
                },    
        
                {CardName: "Seven of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A plethora of fantastical and mysterious options are presented in seven floating chalices. ",         
                 Meaning: "You are feeling overwhelmed with choices, and fear making the wrong one. Quiet your mind and let "
                      + "your heart guide you. ",
                 lgImg: "https://[full path goes here]/large_images/SevenCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SevenCupsRev192x280.png",
                 cardNo: "94"   
                },
                    
                {CardName: "Eight of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A dejected man with back turned walks away from eight cups stacked behind him. ",         
                 Meaning: "You have given it your all but things haven't worked out. It is time to admit defeat "
                      + "and move on. ",
                 lgImg: "https://[full path goes here]/large_images/EightCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightCups192x280.png",
                 cardNo: "95"   
                },    

                {CardName: "Eight of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A dejected man with back turned walks away from eight cups stacked behind him. ",         
                 Meaning: "You are trying to escape a bad situation or failed relationship by abandoning it "
                      + "without taking responsibility. Face the music, have the difficult conversations and "
                      + "do the right thing, even if it is hard. ",
                 lgImg: "https://[full path goes here]/large_images/EightCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightCupsRev192x280.png",
                 cardNo: "96"   
                },
                    
                {CardName: "Nine of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A happy man sits before nine cups arrayed on a curved table behind him. ",         
                 Meaning: "This one is sometimes referred to as the wish card, because it signifies your wish "
                       + "will come true. This is a time of extraordinary luck, happiness and success in all things. ",
                 lgImg: "https://[full path goes here]/large_images/NineCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NineCups192x280.png",
                 cardNo: "97"   
                },    

                {CardName: "Nine of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A happy man sits before nine cups arrayed on a curved table behind him. ",         
                 Meaning: "Good things are happening, the things you have wished for are on the way. Just be patient "
                       + "and let it happen, trying to control the situation will only create problems or delays. ",
                 lgImg: "https://[full path goes here]/large_images/NineCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NineCupsRev192x280.png",
                 cardNo: "98"   
                },
                    
                {CardName: "Ten of Cups", 
                 Arcana: "The Suit of Cups", 
                 Description: "A family contemplates a rainbow containing ten cups overhead. ",         
                 Meaning: "A journey that ends in family contentment and well being, domestic tranquility, "
                       + "peace and security in the home. Happy companionship, joyful and fulfilling marriage, "
                       + "successful parenting. ",
                 lgImg: "https://[full path goes here]/large_images/TenCups340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenCups192x280.png",
                 cardNo: "99"   
                },    

                {CardName: "Ten of Cups reversed", 
                 Arcana: "The Suit of Cups", 
                 Description: "A family contemplates a rainbow containing ten cups overhead. ",         
                 Meaning: "Success seemed within your reach, but it has slipped away. Do not lose heart. "
                       + "Keep your chin up and trust that things will change for the better. ",
                 lgImg: "https://[full path goes here]/large_images/TenCupsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenCupsRev192x280.png",
                 cardNo: "100"   
                },
                    
                    
//===============================SWORDS=================================                    
                    
            {CardName: "King of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A stern king sits on his throne, brandishing a sword as if in judgement. ",         
                 Meaning: "A man of great intellect and authority who can offer good counsel in complex "
                      + "legal, financial, professional or communication matters. If not a specific man, "
                      + "this king represents a matter that requires logical, orderly thinking and discipline "
                      + "in order to achieve success. ",
                 lgImg: "https://[full path goes here]/large_images/KingSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingSwords192x280.png",
                 cardNo: "101"   
                },
                    
                {CardName: "King of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A stern king sits on his throne, brandishing a sword as if in judgement. ",         
                 Meaning: "Gossip, games, personal attacks, and passive aggressive words and behaviors are "
                      + "all around you. Others may mock your goals, plans or epiphanies, so now "
                      + "may not be the best time to share them. ",
                 lgImg: "https://[full path goes here]/large_images/KingSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingSwordsRev192x280.png",
                 cardNo: "102"   
                },
                    
                {CardName: "Queen of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A mature, highly intelligent queen shown in profile on her throne, holding an "
                      + "upright sword in one hand and beckoning with the other. ",         
                 Meaning: "A strong willed woman of great intelligence and intuition, with a knack for creative problem "
                      + "solving. She may have suffered a great loss and emerged stronger for it. "
                      + "If not an actual woman, a time of challenges "
                      + "and struggle is at hand. You must allow your head to overrule your heart in order to succeed. ",
                 lgImg: "https://[full path goes here]/large_images/QueenSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenSwords192x280.png",
                 cardNo: "103"   
                },        

                {CardName: "Queen of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A mature, highly intelligent queen shown in profile on her throne, holding an "
                      + "upright sword in one hand and beckoning with the other. ",         
                 Meaning: "Excessive mourning of a loss is immobilizing you, a loved one, or an associate. ",
                 lgImg: "https://[full path goes here]/large_images/QueenSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenSwordsRev192x280.png",
                 cardNo: "104"   
                },
                    
                {CardName: "The Knight of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A determined looking knight rides into battle at full speed, in full armor, with sword "
                      + "brandished overhead. ",
                 Meaning: "This knight brings news of conflict or infighting that may affect you personally, or "
                      + "someone close to you. There is an indication of anger and building resentments among those "
                      + "involved. Careful diplomacy and a willingness to swallow your pride may be required. ",
                 lgImg: "https://[full path goes here]/large_images/KnightSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightSwords192x280.png",
                 cardNo: "105"   
                },        

                {CardName: "The Knight of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A determined looking knight rides into battle at full speed, in full armor, with sword "
                      + "brandished overhead. ",
                 Meaning: "You are procrastinating in matters that urgently need your attention. Holding back "
                      + "important facts, documents or information is a mistake. ",
                 lgImg: "https://[full path goes here]/large_images/KnightSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightSwordsRev192x280.png",
                 cardNo: "106"   
                },

                {CardName: "The Page of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A young, androgynous figure surveys a windy plain with suspicion, sword hoisted overhead. ",         
                 Meaning: "A young person in your life is facing challenges and problems that are more serious "
                      + "than he or she realizes. This person may have a false sense of confidence that will lead to "
                      + "a classic case of pride before the fall. Be ready to offer advice and assistance if you can. ",
                 lgImg: "https://[full path goes here]/large_images/PageSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PageSwords192x280.png",
                 cardNo: "107"   
                },    
                    
                    
                {CardName: "The Page of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A young, androgynous figure surveys a windy plain with suspicion, sword hoisted overhead. ",         
                 Meaning: "A young person in your life is being flaky, using others for personal gain, or just "
                      + "generally getting by on good looks and charm instead of honest work and commitment. A cocky "
                      + "attitude may be hiding self doubt. ",
                 lgImg: "https://[full path goes here]/large_images/PageSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PageSwordsRev192x280.png",
                 cardNo: "108"   
                },
                    
                
                {CardName: "Ace of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A hand grasping an upturned sword emerges from a cloud. A crown encircles the point "
                      + "of the sword. ",         
                 Meaning: "A triumph of the will has brought victory and new opportunity. ",
                 lgImg: "https://[full path goes here]/large_images/AceSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AceSwords192x280.png",
                 cardNo: "109"   
                },    
            
                {CardName: "Ace of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A hand grasping an upturned sword emerges from a cloud. A crown encircles the point "
                      + "of the sword. ",         
                 Meaning: "A triumph of the will is bringing victory and new opportunity, but there may be unexpected "
                      + "obstacles or delays. Stay the course. Success is close to hand. ",
                 lgImg: "https://[full path goes here]/large_images/AceSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AceSwordsRev192x280.png",
                 cardNo: "110"   
                },
                    
                {CardName: "Two of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A blindfolded female figure balances two swords upon her shoulders. ",         
                 Meaning: "You feel stuck between a rock and a hard place, unwilling to take off "
                      + "your blindfold and face the harsh reality of the situation. Eventually you will "
                      + "have to make a choice and commit to it, wherever it may lead. ",
                 lgImg: "https://[full path goes here]/large_images/TwoSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoSwords192x280.png",
                 cardNo: "111"   
                },    
                    
                {CardName: "Two of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A blindfolded female figure balances two swords upon her shoulders. ",         
                 Meaning: "You feel stuck between a rock and a hard place, and unable to reconcile the two "
                      + "parties or options. Beware of dishonesty or betrayal in the situation. ",
                 lgImg: "https://[full path goes here]/large_images/TwoSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoSwordsRev192x280.png",
                 cardNo: "112"   
                },
                    
                {CardName: "Three of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "Three swords pierce a heart against a backdrop of rain and clouds. ",         
                 Meaning: "Heartbreak, sorrow and regret. The sad end of a once fruitful relationship or "
                      + "partnership. A love triangle gone wrong. ",
                 lgImg: "https://[full path goes here]/large_images/ThreeSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreeSwords192x280.png",
                 cardNo: "113"   
                },    
                    
                {CardName: "Three of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "Three swords pierce a heart against a backdrop of rain and clouds. ",         
                 Meaning: "You are allowing yourself to stay stuck in the painful aftermath of a "
                      + "breakup or failed partnership. You will not be able to move on until you "
                      + "stop blaming others and accept responsibility for your part in the matter. ",
                 lgImg: "https://[full path goes here]/large_images/ThreeSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreeSwordsRev192x280.png",
                 cardNo: "114"   
                },
                    
                {CardName: "Four of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "The carved figure of a praying knight, laid out upon his tomb. ",         
                 Meaning: "Following a period of great pain or defeat, you must withdraw, regroup, and "
                      + "take time to heal yourself emotionally, spiritually, and maybe even physically. ",
                 lgImg: "https://[full path goes here]/large_images/FourSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourSwords192x280.png",
                 cardNo: "115"   
                },
    
                {CardName: "Four of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "The figure of a praying knight, carved upon his tomb. ",         
                 Meaning: "Your body and soul are telling you to take a break, but you are ignoring them. "
                      + "You are on the verge of burnout. Withdraw for a time and allow yourself to rest. ",
                 lgImg: "https://[full path goes here]/large_images/FourSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourSwordsRev192x280.png",
                 cardNo: "116"   
                },
                    
                {CardName: "Five of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A sneering man has disarmed a retreating and defeated pair, "
                      + "and now has all five swords to himself. ",         
                 Meaning: "You may have been beaten fairly or through deceit, but either way "
                      + "you must now accept the consequences and move on. Whatever weakness or "
                      + "shortcoming led to defeat, now is your opportunity to improve on it. ",
                 lgImg: "https://[full path goes here]/large_images/FiveSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FiveSwords192x280.png",
                 cardNo: "117"   
                },    

                {CardName: "Five of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A sneering man has disarmed a retreating and defeated pair, "
                      + "and now has all five swords to himself. ",         
                 Meaning: "You are feeling angry and hurt in the wake of a great loss or defeat. "
                      + "Stop blaming others, or pretending you do not know what happened or why. "
                      + "Face up to your part in the situation. ",
                 lgImg: "https://[full path goes here]/large_images/FiveSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FiveSwordsRev192x280.png",
                 cardNo: "118"   
                },
                    
                {CardName: "Six of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A ferryman carries passengers to the distant shore. Six swords stand "
                      + "upright in the boat. ",         
                 Meaning: "You have made peace with past hardships or defeats and have learned from them. "
                      + "You are ready for a fresh start, and have the tools to make it a success. ",
                 lgImg: "https://[full path goes here]/large_images/SixSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixSwords192x280.png",
                 cardNo: "119"   
                },    

                {CardName: "Six of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A ferryman carries passengers to the distant shore. Six swords stand "
                      + "upright in the boat. ",         
                 Meaning: "You have grown from overcoming past challenges and are ready to apply what "
                      + "you've learned. Do not be discouraged by minor obstacles or delays. You are on the right path. ",
                 lgImg: "https://[full path goes here]/large_images/SixSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixSwordsRev192x280.png",
                 cardNo: "120"   
                },
                    
                {CardName: "Seven of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A man steals five swords from an encampment and sneaks away, leaving two behind. ",         
                 Meaning: "Beware of dishonest dealings in the current situation. You currently have the advantage, "
                      + "but it could easily slip away if you are not careful and alert. Caution, negotiation and "
                      + "tact are required, rather than a forceful, direct approach. Examine every angle before "
                      + "proceeding. ",
                 lgImg: "https://[full path goes here]/large_images/SevenSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SevenSwords192x280.png",
                 cardNo: "121"   
                },    
                    
                {CardName: "Seven of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A man steals five swords from an encampment and sneaks away, leaving two behind. ",         
                 Meaning: "Beware of dishonest dealings in the current situation. You currently have the advantage, "
                      + "but it could easily slip away if you are not careful and alert. Careful negotiation and "
                      + "tact are required. Keep yourself open to new ideas. Do not be too rigid to recognize "
                      + "a better solution when it is offered. ",
                 lgImg: "https://[full path goes here]/large_images/SevenSwordsRev340x340.png",
                 smImg: "https://[full path goes here]/small_images/SevenSwordsRev192x280.png",
                 cardNo: "122"   
                },
                    
                {CardName: "Eight of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A woman, bound and blindfolded, with eight swords driven into the ground behind her. ",         
                 Meaning: "A stressful situation in which you feel powerless to change things. It may be that "
                      + "there is nothing you can do right now, but the situation is temporary. You can "
                      + "recover so long as you are willing to face facts and make hard choices in the future. ",
                 lgImg: "https://[full path goes here]/large_images/EightSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightSwords192x280.png",
                 cardNo: "123"   
                },    

                {CardName: "Eight of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A woman, bound and blindfolded, with eight swords driven in the ground behind her. ",         
                 Meaning: "Things may be about to go from bad to worse. Shore up your finances and home "
                      + "matters as best you can. Ensure your backup plans are in order, and avoid unnecessary "
                      + "spending or risk until the crisis has passed. ",
                 lgImg: "https://[full path goes here]/large_images/EightSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightSwordsRev192x280.png",
                 cardNo: "124"   
                },
                    
                {CardName: "Nine of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A woman cries in bed, with nine swords mounted on the wall behind her. ",         
                 Meaning: "You feel paralyzed by worries and fears that may or may not be justified. "
                      + "Recognize that obsessing will not help. All you can do is take whatever actions "
                      + "are possible to improve the situation, accept that the rest is beyond your control, "
                      + "and let circumstances unfold as they will. ",
                 lgImg: "https://[full path goes here]/large_images/NineSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NineSwords192x280.png",
                 cardNo: "125"   
                },    

                {CardName: "Nine of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A woman cries in bed, with nine swords mounted on the wall behind her. ",         
                 Meaning: "Your plans and dreams have come to naught, and it is time to change direction. "
                      + "The longer you continue to stay in denial, the worse things will get. Cut your "
                      + "losses and move on, however painful it may be. ",
                 lgImg: "https://[full path goes here]/large_images/NineSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NineSwordsRev192x280.png",
                 cardNo: "126"   
                },
                    
                {CardName: "Ten of Swords", 
                 Arcana: "The Suit of Swords", 
                 Description: "A figure lies on the ground, face down, pierced by ten swords. ",         
                 Meaning: "It is time to cut your losses and move on from a failed "
                      + "situation or relationship. You have experienced a figurative death, "
                      + "and are ready for rebirth. ",
                 lgImg: "https://[full path goes here]/large_images/TenSwords340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenSwords192x280.png",
                 cardNo: "127"   
                },    

                {CardName: "Ten of Swords reversed", 
                 Arcana: "The Suit of Swords", 
                 Description: "A figure lies on the ground, face down, pierced by ten swords. ",         
                 Meaning: "You feel yourself at a crossroads, immobilized by fear of making the "
                      + "wrong choice. Refusing to choose is still a choice however, and your delay "
                      + "is making things worse. Stop procrastinating and make a decision. ",
                 lgImg: "https://[full path goes here]/large_images/TenSwordsRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenSwordsRev192x280.png",
                 cardNo: "128"   
                },
    
                    
//=================PENTACLES================================                    
                    
                {CardName: "King of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "An obviously wealthy, richly attired king sits upon a heavily decorated throne. ",
                 Meaning: "A worldly wise, accomplished and successful man with a solid reputation. He "
                      + "can offer good advice in matters of money, commerce and business. If he does not "
                      + "represent an actual man, the king is an indication of success in finances, "
                      + "commerce or business. ",
                 lgImg: "https://[full path goes here]/large_images/KingPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingPentacles192x280.png",
                 cardNo: "129"   
                },
                    
                {CardName: "King of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "An obviously wealthy, richly attired king sits upon a heavily decorated throne. ",
                 Meaning: "Be wary of double dealing in business or financial matters. Read any contracts very closely "
                      + "and be sure you understand them. ",
                 lgImg: "https://[full path goes here]/large_images/KingPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KingPentaclesRev192x280.png",
                 cardNo: "130"   
                },  

                {CardName: "Queen of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A kindly face and gentle bearing characterize this queen. She sits on her "
                      + "throne in contemplation of a pentacle coin. ",         
                 Meaning: "A confident and accomplished woman who is comfortable in her own skin. She "
                      + "can offer honest and fair advice in practical matters of money, business or household. "
                      + "If she does not represent an actual woman, she represents a bountiful harvest after heavy "
                      + "toil and wise management of resources. ",
                 lgImg: "https://[full path goes here]/large_images/QueenPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenPentacles192x280.png",
                 cardNo: "131"   
                },
                    
                {CardName: "Queen of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A kindly face and gentle bearing characterize this queen. She sits on her "
                      + "throne in contemplation of a pentacle coin. ",         
                 Meaning: "A controlling woman who may work against you, either actively or through inaction. If "
                      + "not an actual person, a fraught situation where caution is advised. ",
                 lgImg: "https://[full path goes here]/large_images/QueenPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/QueenPentaclesRev192x280.png",
                 cardNo: "132"   
                },         

                {CardName: "The Knight of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A knight is seated on his mount, presenting a pentacle coin. ",         
                 Meaning: "A loyal and hardworking man who is reliable, though not ambitious or imaginative. "
                      + "If he does not represent an actual person, he represents a need for change in "
                      + "work or financial plans. ",
                 lgImg: "https://[full path goes here]/large_images/KnightPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightPentacles192x280.png",
                 cardNo: "133"   
                },
                    
                {CardName: "The Knight of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A knight is seated on his mount, presenting a pentacle coin. ",         
                 Meaning: "Bad news about business or financial matters is coming. Alternatively, the card "
                      + "may represent a shiftless young man who refuses to work. ",
                 lgImg: "https://[full path goes here]/large_images/KnightPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/KnightPentaclesRev192x280.png",
                 cardNo: "134"   
                },    

                {CardName: "The Page of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A youthful figure, looking intently at the pentacle coin which hovers over his raised "
                      + "hands. He appears entranced by it. ",         
                 Meaning: "The page is a bringer of positive financial news. An unexpected windfall or opportunity is coming. ",
                 lgImg: "https://[full path goes here]/large_images/PagePentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PagePentacles192x280.png",
                 cardNo: "135"   
                },
                    
                {CardName: "The Page of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A youthful figure, looking intently at the pentacle coin which hovers over his raised "
                      + "hands. He appears entranced by it. ",         
                 Meaning: "A young person who chooses to be financially dependent on others, rather than pursue "
                      + "employment or career training. If not an actual person, the card may signify bad news. ",
                 lgImg: "https://[full path goes here]/large_images/PagePentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/PagePentaclesRev192x280.png",
                 cardNo: "136"   
                },    

                {CardName: "Ace of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A hand holding a pentacle coin reaches out from a cloud. ",         
                 Meaning: "A happy financial omen. A new project or endeavor will bring financial success. ",
                 lgImg: "https://[full path goes here]/large_images/AcePentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AcePentacles192x280.png",
                 cardNo: "137"   
                },
                    
                {CardName: "Ace of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A hand holding a pentacle coin reaches out from a cloud. ",         
                 Meaning: "Be sure that You have explored every aspect of your new project or endeavor. "
                      + "Do not try to rush things, or get frustrated because it is taking longer than you "
                      + "hoped to see progress. ",
                 lgImg: "https://[full path goes here]/large_images/AcePentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/AcePentaclesRev192x280.png",
                 cardNo: "138"   
                },    

                {CardName: "Two of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A young man dances while juggling two pentacle coins within an infinity symbol. ",         
                 Meaning: "Financial, business and personal priorities must be juggled for a time, "
                     + "but the outcome will be positive. ",
                 lgImg: "https://[full path goes here]/large_images/TwoPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoPentacles192x280.png",
                 cardNo: "139"   
                },
                    
                {CardName: "Two of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A young man dances while juggling two pentacle coins within an infinity symbol. ",         
                 Meaning: "You are juggling finances and resources and may be feeling a little desperate. Be "
                      + "patient and do not rush into any major changes. A better opportunity to improve the "
                      + "situation will come if you can wait for it. ",
                 lgImg: "https://[full path goes here]/large_images/TwoPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TwoPentaclesRev192x280.png",
                 cardNo: "140"   
                },    

                {CardName: "Three of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A sculptor at his work in a monastery. ",         
                 Meaning: "It is the right time to gain new education or skills and turn them toward profit. Your "
                     + "reputation and earning power are on the rise. ",
                 lgImg: "https://[full path goes here]/large_images/ThreePentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreePentacles192x280.png",
                 cardNo: "141"   
                },
                    
                {CardName: "Three of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A sculptor at his work in a monastery. ",         
                 Meaning: "Inertia is holding you back from learning new skills or seeking better, more "
                     + "challenging opportunities. You must be willing to do the work to reap the rewards. ",
                 lgImg: "https://[full path goes here]/large_images/ThreePentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/ThreePentaclesRev192x280.png",
                 cardNo: "142"   
                },    

                {CardName: "Four of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A miser holds tight to his three pentacle coins. A fourth rests in his crown. ",         
                 Meaning: "Fear of change or loss is keeping you immobile and closing you off to new opportunities. ",
                 lgImg: "https://[full path goes here]/large_images/FourPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourPentacles192x280.png",
                 cardNo: "143"   
                },
                    
                {CardName: "Four of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A miser holds tight to his three pentacle coins. A fourth rests in his crown. ",         
                 Meaning: "Opportunities for happiness and growth are passing you by as you remain in fear or "
                     + "denail. Stop clinging so tightly to material things. Seek deeper connections and more "
                     + "meaningful relationships. ",
                 lgImg: "https://[full path goes here]/large_images/FourPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FourPentaclesRev192x280.png",
                 cardNo: "144"   
                },    

                {CardName: "Five of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "Two beggars in a snowstorm pass beneath a lighted window. ",         
                 Meaning: "Financial troubles or insecurity are coming. This is a good time to cut expenses "
                     + "and set some funds aside for a rainy day. Alternatively, the card can represent spiritual bankruptcy. ",
                 lgImg: "https://[full path goes here]/large_images/FivePentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FivePentacles192x280.png",
                 cardNo: "145"   
                },
                    
                {CardName: "Five of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "Two beggars in a snowstorm pass beneath a lighted window. ",         
                 Meaning: "You have allowed your finances to get away from you, and it is becoming a "
                     + "serious problem. Take charge of the situation. Seek guidance from a trusted "
                     + "advisor if necessary. Do not let shame or denial allow you to keep digging "
                     + "the hole deeper. ",
                 lgImg: "https://[full path goes here]/large_images/FivePentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/FivePentaclesRev192x280.png",
                 cardNo: "146" 
                },    

                {CardName: "Six of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A prosperous merchant distributes alms to the poor. He holds a set of scales in one hand. ",         
                 Meaning: "You have experienced, and are grateful for, financial gains. You are now in a position to "
                     + "share the wealth. Find good causes and people to support. ",
                 lgImg: "https://[full path goes here]/large_images/SixPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixPentacles192x280.png",
                 cardNo: "147"   
                },
                    
                {CardName: "Six of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles",
                 Description: "A prosperous merchant distributes alms to the poor. He holds a set of scales in one hand. ",
                 Meaning: "You have been a little too generous with your time, energy or money and "
                     + "are now depleted. You must take time to regroup and recuperate, though it "
                     + "pains you to stop giving. Remember that you can only continue to care for others "
                     + "so long as you are taking care of yourself.",
                 lgImg: "https://[full path goes here]/large_images/SixPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SixPentaclesRev192x280.png",
                 cardNo: "148" 
                },    

                {CardName: "Seven of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A young man leans on his staff and looks intently at seven pentacles attached "
                      + "to a clump of greenery on his right, admiring his possessions or the fruits of his labor. ",         
                 Meaning: "You have worked hard to grow your business or achieve financial security, and it is going very well. "
                      + "It will soon be time to harvest your well deserved gains. ",
                 lgImg: "https://[full path goes here]/large_images/SevenPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SevenPentacles192x280.png",
                 cardNo: "149"   
                },
                    
                {CardName: "Seven of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A young man leans on his staff and looks intently at seven pentacles attached "
                      + "to a clump of greenery on his right, admiring his possessions or the fruits of his labor. ",         
                 Meaning: "You are struggling financially, and may be regretting an investment or expenditure "
                      + "that hasn't panned out. Learn what you can from the experience so you can make a wiser "
                      + "choice next time. ",
                 lgImg: "https://[full path goes here]/large_images/SevenPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/SevenPentaclesRev192x280.png",
                 cardNo: "150" 
                },    

                {CardName: "Eight of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "An artist at his carving work, which he exhibits like trophies. ",         
                 Meaning: "You are adding new, profitable skills to your professional repertoire. Your hard work "
                     + "will pay off financially, as well as in terms of your professional reputation. ",
                 lgImg: "https://[full path goes here]/large_images/EightPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightPentacles192x280.png",
                 cardNo: "151"   
                },
                    
                {CardName: "Eight of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "An artist at his carving work, which he exhibits like trophies. ",         
                 Meaning: "You are trying to move into a new role or profession for which you are not yet "
                      + "prepared. Take the necessary time to get additional experience, education or training. "
                      + "Rushing ahead or trying to skip steps will be your undoing. ",
                 lgImg: "https://[full path goes here]/large_images/EightPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/EightPentaclesRev192x280.png",
                 cardNo: "152" 
                },    

                {CardName: "Nine of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A woman with a bird upon her wrist stands amid a great abundance of grapevines "
                      + "in the garden of a manor house. ",         
                 Meaning: "This card suggests plenty in all things, and material well being. Enjoyment of rewards well earned. ",
                 lgImg: "https://[full path goes here]/large_images/NinePentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NinePentacles192x280.png",
                 cardNo: "153"   
                },
                    
                {CardName: "Nine of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A woman with a bird upon her wrist stands amid a great abundance of grapevines "
                      + "in the garden of a manor house. ",         
                 Meaning: "You have lost your financial independence, either through your own bad choices or "
                      + "circumstances beyond your control. Either way, now is the time to "
                      + "figure out what went wrong, and how to turn things around. ",
                 lgImg: "https://[full path goes here]/large_images/NinePentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/NinePentaclesRev192x280.png",
                 cardNo: "154" 
                },    

                {CardName: "Ten of Pentacles", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A man and woman beneath an archway leading to a house and village. "
                      + "They are accompanied by a child, two well behaved dogs and an elderly man. ",         
                 Meaning: "Family wealth and security. A new home, or purchase of a second home. Happy "
                      + "and secure retirement. ",
                 lgImg: "https://[full path goes here]/large_images/TenPentacles340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenPentacles192x280.png",
                 cardNo: "155"   
                },

                {CardName: "Ten of Pentacles reversed", 
                 Arcana: "The Suit of Pentacles", 
                 Description: "A man and woman beneath an archway leading to a house and village. "
                      + "They are accompanied by a child, two well behaved dogs and an elderly man. ",         
                 Meaning: "You have become complacent in your financial or domestic security. Take up a new "
                      + "hobby, enroll in a class, meet some new people, or find other ways to challenge yourself. ",
                 lgImg: "https://[full path goes here]/large_images/TenPentaclesRev340x340.png", 
                 smImg: "https://[full path goes here]/small_images/TenPentaclesRev192x280.png",
                 cardNo: "156" 
                }

];

console.log("aryDeck is set." );
  

//====================================
// BEGIN HANDLERS
//====================================

const handlers = {
    

    
//===============================================
// NewSession FUNCTION
//===============================================


'NewSession': function() {
    
    console.log("Active function is NewSession. ");
    
    var sessionAttributes = {};
    sessionAttributes = this.attributes;
    
// VIRTUAL COIN TOSSES TO DETERMINE IF THE UPRIGHT (EVEN-NUMBERED ARRAY INDICES)
// OR REVERSED (ODD-NUMBERED ARRAY INDICES) WILL BE SELECTED. 

    
// GENERATE RANDOM NUMBER 0 OR 1 TO DETERMINE ORIENTATION OF EACH CARD IN
// THREE CARD (tc) READING. 0 = UPRIGHT, 1 = REVERSED. 
    
    sessionAttributes['tcFlipOne'] = Math.floor(Math.random() * 2);
    console.log('tcFlipOne is set to ' +sessionAttributes['tcFlipOne']+ '. ');

    sessionAttributes['tcFlipTwo'] = Math.floor(Math.random() * 2);
    console.log('tcFlipTwo is set to ' +sessionAttributes['tcFlipTwo']+ '. ');

    sessionAttributes['tcFlipThree'] = Math.floor(Math.random() * 2);
    console.log('tcFlipThree is set to ' +sessionAttributes['tcFlipThree']+ '. ');
    
// GENERATE RANDOM NUMBER 0 OR 1 TO DETERMINE ORIENTATION OF CARDS IN CELTIC CROSS (cc) 
// READING. 0 = UPRIGHT, 1 = REVERSED. THERE ARE TEN CARDS IN THIS READING.
    
    sessionAttributes['ccFlipOne'] = Math.floor(Math.random() * 2);
    console.log('ccFlipOne is set to ' +sessionAttributes['ccFlipOne']+ '. ');

    sessionAttributes['ccFlipTwo'] = Math.floor(Math.random() * 2);
    console.log('ccFlipTwo is set to ' +sessionAttributes['ccFlipTwo']+ '. ');

    sessionAttributes['ccFlipThree'] = Math.floor(Math.random() * 2);
    console.log('ccFlipThree is set to ' +sessionAttributes['ccFlipThree']+ '. ');
    
    sessionAttributes['ccFlipFour'] = Math.floor(Math.random() * 2);
    console.log('ccFlipFour is set to ' +sessionAttributes['ccFlipFour']+ '. ');

    sessionAttributes['ccFlipFive'] = Math.floor(Math.random() * 2);
    console.log('ccFlipFive is set to ' +sessionAttributes['ccFlipFive']+ '. ');

    sessionAttributes['ccFlipSix'] = Math.floor(Math.random() * 2);
    console.log('ccFlipSix is set to ' +sessionAttributes['ccFlipSix']+ '. ');
    
    sessionAttributes['ccFlipSeven'] = Math.floor(Math.random() * 2);
    console.log('ccFlipSeven is set to ' +sessionAttributes['ccFlipSeven']+ '. ');

    sessionAttributes['ccFlipEight'] = Math.floor(Math.random() * 2);
    console.log('ccFlipEight is set to ' +sessionAttributes['ccFlipEight']+ '. ');

    sessionAttributes['ccFlipNine'] = Math.floor(Math.random() * 2);
    console.log('ccFlipNine is set to ' +sessionAttributes['ccFlipNine']+ '. ');
    
    sessionAttributes['ccFlipTen'] = Math.floor(Math.random() * 2);
    console.log('ccFlipTen is set to ' +sessionAttributes['ccFlipTen']+ '. ');
    

// PULL CARDS FOR ALL POSSIBLE READINGS IN THE SESSION AND
// STORE THEM TO SUBSET ARRAY OBJECT. 
//
// THIS ENSURES USER CAN REQUEST ALL THREE TYPES OF READINGS
// IN A SINGLE SESSION, AND CAN GO BACK TO REVISIT CARDS
// FROM EACH TYPE OF READING WITHIN THE SAME SESSION. 

        var aryReadings = []; // JAVASCRIPT ARRAY TO HOLD ALL
                              // CARDS PULLED FOR READINGS.
        
        // LOGIC TO SELECT CARD INDICES FOR SINGLE CARD,
        // THREE CARD AND CC READINGS IMMEDIATELY UPON
        // LAUNCH, STORE INDICES FOR EACH AS SESSION VARIABLES
        // TO PASS AS TOKENS FOR EACH CARD POSITION IN 
        // THE APPROPRIATE READING SCREENS BELOW. IT'S LIKE
        // HARD-CODING THAT ONLY LASTS FOR ONE SESSION.
        //
        // USERS CAN ONLY ACCESS THE selectedCardView SCREEN
        // FROM THE READING SCREENS, SO THE SCREEN THE
        // USER IS DRILLING DOWN FROM WILL PASS THE CORRECT
        // TOKEN WITH EACH ElementSelected INTENT.
        
        
        // SELECT RANDOM CARD FROM aryDeck FOR SINGLE CARD READING
        // (aka RANDOM CARD, ABBREVIATED AS "rc") & SAVE TO VARIABLE random1
        var random1 = Math.floor(Math.random() * aryDeck.length);
        
        //----------------------------------------------------
        
        // SELECT THREE CARDS FOR 3 CARD READING
        // DECLARE PLACEHOLDERS FOR THE 3 SELECTED CARDS
        
        var random3_1 = '';
        var random3_2 = '';
        var random3_3 = '';
        
        // CREATE AN ARRAY OF EVEN-NUMBERED INDICES IN aryDeck IN ORDER TO SHUFFLE
        // AND PULL THREE INDICES AT RANDOM. FASTER THAN SHUFFLING THE
        // HUGE aryDeck ARRAY, AND THE ABOVE VIRTUAL COIN TOSSES WILL BE USED TO
        // DETERMINE WHETHER TO DISPLAY THE UPRIGHT VERSION OF THE CARD OR
        // THE REVERSED (SEE LINE .
           
           var aryCards3 = [];
           var newArray3 = [];
    
        aryCards3 = [0,2,4,6,8,10,12,14,
		              16,18,20,22,24,26,28,30,
		              32,34,36,38,40,42,44,
		              46,48,50,52,54,56,58,60,
		              62,64,66,68,70,72,74,
                      76,78,80,82,84,86,88,90,
                      92,94,96,98,100,102,104,
                      106,108,110,112,114,
                      116,118,120,122,124,126,
                      128,130,132,134,136,
                      138,140,142,144,146,148,
                      150,152,154];
           
        
            // SELECT 3 CARDS FOR 3 CARD READING & ASSIGN EACH VALUE TO VAR CONTAINER.
            // IF STATEMENTS COMPARE AGAINST VIRTUAL COIN FLIPS TO SELECT CORRECT
            // CARD ORIENTATION.
        
            const aryShuffle3 = aryCards3.sort(() => .5 - Math.random());  
            newArray3 = aryShuffle3.slice(0,3); 
            console.log("Random indices selected are " +newArray3[0]+ ", " +newArray3[1]+ ", " +newArray3[2]+ ". ");
        
            if (sessionAttributes['tcFlipOne'] == 0) {
                random3_1 = newArray3[0]; // KEEP INDEX AS UPRIGHT VERSION
            } else {
                random3_1 = parseFloat(newArray3[0]) + 1; // INCREMENT BY ONE TO SET INDEX TO REVERSED VERSION 
            }    
            console.log('random3_1 index is ' +random3_1+ '. '); 
    
            if (sessionAttributes['tcFlipTwo'] == 0) {
                random3_2 = newArray3[1];
            } else {
                random3_2 = parseFloat(newArray3[1]) + 1;
            }
            console.log('random3_2 index is ' +random3_2+ '. ');
    
            if (sessionAttributes['tcFlipThree'] == 0) {
                random3_3 = newArray3[2];
            } else {
                random3_3 = parseFloat(newArray3[2]) + 1;
            }
            console.log('random3_3 index is ' +random3_3+ '. ');
        
        
        //-------------------------------------------------------------
        
        // DECLARE VARS FOR CC READING CARDS
        
        var random10_1 = '';
        var random10_2 = '';
        var random10_3 = '';
        var random10_4 = '';
        var random10_5 = '';
        var random10_6 = '';
        var random10_7 = '';
        var random10_8 = '';
        var random10_9 = '';
        var random10_10 = '';
        
        // CREATE AN ARRAY OF ALL INDICES IN aryDeck IN ORDER TO SHUFFLE
        // AND PULL TEN INDICES AT RANDOM. FASTER THAN SHUFFLING THE
        // HUGE aryDeck ARRAY.
           
           var aryCards10 = [];
           var newArray10 = [];
    
           aryCards10 = [0,2,4,6,8,10,12,14,
		              16,18,20,22,24,26,28,30,
		              32,34,36,38,40,42,44,
		              46,48,50,52,54,56,58,60,
		              62,64,66,68,70,72,74,
                      76,78,80,82,84,86,88,90,
                      92,94,96,98,100,102,104,
                      106,108,110,112,114,
                      116,118,120,122,124,126,
                      128,130,132,134,136,
                      138,140,142,144,146,148,
                      150,152,154];
          
        
            // SELECT 10 CARDS FOR CC READING & ASSIGN EACH VALUE TO VAR CONTAINER.
            // IF STATEMENTS COMPARE AGAINST VIRTUAL COIN FLIPS TO SELECT CORRECT
            // CARD ORIENTATION.
           
            const aryShuffle10 = aryCards10.sort(() => .5 - Math.random());  
            newArray10 = aryShuffle10.slice(0,10); 
    
    
            if (sessionAttributes['ccFlipOne'] == 0) {
                random10_1 = newArray10[0]; // KEEP INDEX AS UPRIGHT VERSION
            } else {
                random10_1 = parseFloat(newArray10[0]) + 1; // INCREMENT BY ONE TO SET INDEX TO REVERSED VERSION 
            }    
            console.log('random10_1 index is ' +random10_1+ '. ');
    
    
            if (sessionAttributes['ccFlipTwo'] == 0) {
                random10_2 = newArray10[1];
            } else {
                random10_2 = parseFloat(newArray10[1]) + 1;
            }
            console.log('random10_2 index is ' +random10_2+ '. ');
    
    
            if (sessionAttributes['ccFlipThree'] == 0) {
                random10_3 = newArray10[2];
            } else {
                random10_3 = parseFloat(newArray10[2]) + 1;
            }
            console.log('random10_3 index is ' +random10_3+ '. ');
    
    
            if (sessionAttributes['ccFlipFour'] == 0) {
                random10_4 = newArray10[3]; 
            } else {
                random10_4 = parseFloat(newArray10[3]) + 1; // INCREMENT BY ONE TO SET INDEX TO REVERSED VERSION 
            }    
            console.log('random10_4 index is ' +random10_4+ '. '); 
    
    
            if (sessionAttributes['ccFlipFive'] == 0) {
                random10_5 = newArray10[4];
            } else {
                random10_5 = parseFloat(newArray10[4]) + 1;
            }
            console.log('random10_5 index is ' +random10_5+ '. ');
    
    
            if (sessionAttributes['ccFlipSix'] == 0) {
                random10_6 = newArray10[5];
            } else {
                random10_6 = parseFloat(newArray10[5]) + 1;
            }
            console.log('random10_6 index is ' +random10_6+ '. ');
    
    
            if (sessionAttributes['ccFlipSeven'] == 0) {
                random10_7 = newArray10[6];
            } else {
                random10_7 = parseFloat(newArray10[6]) + 1;
            }
            console.log('random10_7 index is ' +random10_7+ '. ');
    
    
            if (sessionAttributes['ccFlipEight'] == 0) {
                random10_8 = newArray10[7];
            } else {
                random10_8 = parseFloat(newArray10[7]) + 1;
            }
            console.log('random10_8 index is ' +random10_8+ '. ');
    
    
            if (sessionAttributes['ccFlipNine'] == 0) {
                random10_9 = newArray10[8];
            } else {
                random10_9 = parseFloat(newArray10[8]) + 1;
            }
            console.log('random10_9 index is ' +random10_9+ '. ');
    
    
            if (sessionAttributes['ccFlipTen'] == 0) {
                random10_10 = newArray10[9];
            } else {
                random10_10 = parseFloat(newArray10[9]) + 1;
            }
            console.log('random10_10 index is ' +random10_10+ '. ');

        
        //------------------------------------------------------------        
        // STORE ALL PULLED INDEX NUMBERS IN NEW ARRAY FOR USE IN SESSION ATTRIBUTES
        
        aryReadings = [
            random1, 
            random3_1, 
            random3_2, 
            random3_3, 
            random10_1,
            random10_2,
            random10_3,
            random10_4,
            random10_5,
            random10_6,
            random10_7,
            random10_8,
            random10_9,
            random10_10
        ];
        
        console.log ("aryReadings members are " + aryReadings[0] + ", " + aryReadings[1] + ", " + aryReadings[2] + ", " + aryReadings[3] + ", " + aryReadings[4] + ", " + aryReadings[5] + ", " + aryReadings[6] + ", " + aryReadings[7] + ", " + aryReadings[8] + ", " + aryReadings[9] + ", " + aryReadings[10] + ", " + aryReadings[11] + ", " + aryReadings[12] + ", " + aryReadings[13] + ". ");

    
    // THESE SESSION ATTRIBUTES ARE USED IN goBackIntent, ElementSelectedIntent 
    // AND SelectNumberIntent FUNCTIONS
    
        this.attributes['screen'] = "none";
        this.attributes['goback'] = "none";
    
    // THESE SESSION ATTRIBUTES ARE USED IN SINGLE CARD VIEW (showSC) FUNCTION
        this.attributes['scSSML'] = "";
        this.attributes['scTitle'] = "";
        this.attributes['scImageURL'] = "";
        this.attributes['scImageDesc'] = "";
        this.attributes['scCardName'] = "";
        this.attributes['scMeaning'] = "";
    
    // THESE SESSION ATTRIBUTES ARE USED IN 'show' SCREEN LOAD
    // FUNCTIONS TO FIRE INTRO MESSAGE ONLY
    // THE FIRST TIME USER VISITS THAT SCREEN,
    // BLANK OUT THE SPEECH WHEN USER GOES BACK
    // TO SCREEN
    
        this.attributes['homeSSML'] = "";
        this.attributes['maSSML'] = "";
        this.attributes['tcSSML'] = "";
        this.attributes['ccSSML'] = "";
        this.attributes['wandsSSML'] = "";
        this.attributes['cupsSSML'] = "";
        this.attributes['swordsSSML'] = "";
        this.attributes['pentaclesSSML'] = "";
    
    // THESE SESSION ATTRIBUTES ARE IN RANDOM CARD (rc), THREE CARD (tc)
    // AND CELTIC CROSS (cc) READINGS
    
        this.attributes['rc'] = aryReadings[0];
        this.attributes['tcOne'] = aryReadings[1];
        this.attributes['tcTwo'] = aryReadings[2];
        this.attributes['tcThree'] = aryReadings[3];
        this.attributes['ccOne'] = aryReadings[4];
        this.attributes['ccTwo'] = aryReadings[5];
        this.attributes['ccThree'] = aryReadings[6];
        this.attributes['ccFour'] = aryReadings[7];
        this.attributes['ccFive'] = aryReadings[8];
        this.attributes['ccSix'] = aryReadings[9];
        this.attributes['ccSeven'] = aryReadings[10];
        this.attributes['ccEight'] = aryReadings[11];
        this.attributes['ccNine'] = aryReadings[12];
        this.attributes['ccTen'] = aryReadings[13];
    
        console.log("SessionAttributes members are set. "); 
    
        sessionAttributes['homeSSML'] = '<speak>Welcome to Visual Tarot. Select Card Encyclopedia, or a reading, '
                        + 'by list number. Say help for more information. </speak>';
    
        sessionAttributes['screen'] = 'home';
    
        this.emit('showHome'); // WHEN NEW SESSION STARTS, LOAD HOME SCREEN
        
},
    
//===================================
// END NewSession FUNCTION
//===================================
    
    

    
//=======================================
// ELEMENT SELECTED FUNCTION
//=======================================
    
// THIS FUNCTION PERFORMS TWO TASKS. 
//
// 1. DETERMINE WHICH DISPLAY TEMPLATE LIST ITEM WAS SELECTED
//      AND ROUTE THE REQUEST TO THE APPROPRIATE HANDLER FUNCTION.
//
// 2. UPDATE THE goback SESSION ATTRIBUTE TO KEEP TRACK OF WHICH
//      SCREEN THE USER SHOULD BE RETURNED TO WHEN THE USER WANTS
//      "GO BACK": WHEN AN UTTERANCE MAPPED TO AMAZON.PreviousIntent
//      IS SPOKEN WHILE USER IS ON WHATEVER SCREEN LOADS AS A RESULT 
//      OF THE HANDLER FUNCTION THAT FIRES FROM #1.

    
    
'ElementSelected': function () {
    var selectedToken = '';        
    selectedToken = this.event.request.token;
    console.log("selectedToken = " +selectedToken+ ". ");
    
    var sessionAttributes = {};
    sessionAttributes = this.attributes;
    
    console.log("sessionAttributes[screen] is set to " +sessionAttributes['screen']+ ". ");
    
    if (sessionAttributes['screen'] == "home") { // sessionAttributes['screen'] IS UPDATED WHEN EACH
                                                 // SCREEN LOADS, SEE 'show[ScreenName]' HANDLERS BELOW
        
        console.log("ElementSelected firing from Home screen. ");

        //----------CARD ENCYCLOPEDIA OPTION SELECTED---------------
    
        if (selectedToken == 1) {
    
            console.log('Home screen selected token is 1: Show Encyclopedia. ');
            
            sessionAttributes['goback'] = "home"; // ENCYCLOPEDIA CAN ONLY BE SELECTED FROM HOME SCREEN
                                                  // SO goback VALUE HERE CAN ONLY BE home.  
            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['suitsSSML'] = '<speak>Select Major Arcana, or the suit you are interested in, by list number.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'suits';
            this.emit('showSuits'); // suits IS THE DESIGNATION FOR THE CARD ENCYCLOPEDIA SCREEN.
 
        //-------RANDOM / 1 CARD READING SELECTED--------------------

        } else if (selectedToken == 2) {
            
            console.log('Home screen selected token is 2: One Card Reading. ');
        
            sessionAttributes['goback'] = "home"; // ONE CARD READING CAN ONLY BE SELECTED FROM HOME SCREEN
                                                  // SO goback VALUE HERE CAN ONLY BE home. 
            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'rc';
        
            this.emit('showRC');

        //------------THREE CARD READING SELECTED------------------
        
        } else if (selectedToken == 3) {
            
            console.log('Home screen selected token is 3: Three Card Reading. ');
            
            sessionAttributes['goback'] = "home"; // THREE CARD READING CAN ONLY BE SELECTED FROM HOME SCREEN
                                                  // SO goback VALUE HERE CAN ONLY BE home. 
                       
            console.log("this.attributes['goback'] is set to " +this.attributes['goback']+ ". ");
            
            sessionAttributes['tcSSML'] = '<speak>Here is your three card reading, also known as a Past, Present and Future reading. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'tc';
            
            this.emit('showTC');
            
        //------------CC READING SELECTED----------------------------
        
        } else if (selectedToken == 4) {
            
            console.log('Home screen selected token is 4: Celtic Cross Reading. ');
            
            sessionAttributes['goback'] = "home"; // CELTIC CROSS READING CAN ONLY BE SELECTED FROM HOME SCREEN
                                                  // SO goback VALUE HERE CAN ONLY BE home. 
                       
            console.log("this.attributes['goback'] is set to " +this.attributes['goback']+ ". ");
            
            sessionAttributes['ccSSML'] = '<speak>Here is your Celtic Cross reading. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'cc';
            
            this.emit('showCC');
            
   
        //-------------NO VALID SELECTION DETECTED---------------------
            
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
    
    } else if (sessionAttributes['screen'] == "suits") { // suits IS THE DESIGNATION FOR THE CARD ENCYCLOPEDIA SCREEN.
        
        console.log("ElementSelected firing from Suits screen. ");
        
        //------------MAJOR ARCANA LIST SELECTED------------------
    
        if (selectedToken == 1) { 
            
            sessionAttributes['goback'] = "suits"; // MAJOR ARCANA CARD LIST CAN ONLY BE SELECTED FROM SUITS SCREEN
                                                   // SO goback VALUE HERE CAN ONLY BE suits. 
                                  
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['maSSML'] = '<speak>Here are the cards in the Major Arcana. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';            
            
            sessionAttributes['screen'] = 'ma';
            this.emit('showMA');
            
        //-------------WANDS LIST SELECTED--------------------------
    
        } else if (selectedToken == 2) {
            
            sessionAttributes['goback'] = "suits"; // WANDS CARD LIST CAN ONLY BE SELECTED FROM SUITS SCREEN
                                                   // SO goback VALUE HERE CAN ONLY BE suits. 
                                             
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['wandsSSML'] = '<speak>Here are the cards in the suit of Wands. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'wands';
            
            this.emit('showWands');
            
        //----------------CUPS LIST SELECTED------------------------
        
        } else if (selectedToken == 3) {
            
            sessionAttributes['goback'] = "suits"; // CUPS CARD LIST CAN ONLY BE SELECTED FROM SUITS SCREEN
                                                   // SO goback VALUE HERE CAN ONLY BE suits. 
                                                        
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['wandsSSML'] = '<speak>Here are the cards in the suit of Cups. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'cups';
            
            this.emit('showCups');
            
        //-------------SWORDS LIST SELECTED----------------------------
        
        } else if (selectedToken == 4) {
            
            sessionAttributes['goback'] = "suits"; // SWORDS CARD LIST CAN ONLY BE SELECTED FROM SUITS SCREEN
                                                   // SO goback VALUE HERE CAN ONLY BE suits. 
                                                                
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['wandsSSML'] = '<speak>Here are the cards in the suit of Swords. Select a card by list number to view its details.  Say go back to return to the previous menu.</speak>';
            
            sessionAttributes['screen'] = 'swords';
            
            this.emit('showSwords');
            
        //------------PENTACLES LIST SELECTED-------------------------
        
        } else if (selectedToken == 5) {
            
            sessionAttributes['goback'] = "suits"; // PENTACLES CARD LIST CAN ONLY BE SELECTED FROM SUITS SCREEN
                                                   // SO goback VALUE HERE CAN ONLY BE suits. 
                                                                
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['wandsSSML'] = '<speak>Here are the cards in the suit of Pentacles. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'pentacles';
            
            this.emit('showPentacles');
            
        //----------NO VALID SELECTION DETECTED------------------------
        
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
    
    } else if (sessionAttributes['screen'] == "tc") { // THREE CARD READING SELECTED.
        
        console.log("ElementSelected firing from TC screen. ");
        
        // IF SELECT SCREEN WAS tc, MAP selectedToken TO CORRECT SESSION ATTRIBUTE VALUE TO POPULATE SCREEN.
        // RECALL THAT tcOne - tcThree ARE THE INDICES STORED TO SESSION ATTRIBUTES FOR A THREE CARD READING. 
        
        if (selectedToken == 1) {
            
            var tcOne = sessionAttributes['tcOne']; 
            console.log('tcOne is set to ' +tcOne+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[tcOne].CardName; 
            
            sessionAttributes['scMeaning'] = aryDeck[tcOne].Meaning;
            
            sessionAttributes['scTitle'] = 'The Past';
            
            sessionAttributes['scSSML'] = '<speak>The past. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[tcOne].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            
            sessionAttributes['goback'] = "tc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
    
    
        } else if (selectedToken == 2) {
            
            var tcTwo = sessionAttributes['tcTwo'];
            console.log('tcTwo is set to ' +tcTwo+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[tcTwo].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[tcTwo].Meaning;
            
            sessionAttributes['scTitle'] = 'The Present';
            
            sessionAttributes['scSSML'] = '<speak>The present. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[tcTwo].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "tc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else if (selectedToken == 3) {
            
            var tcThree = sessionAttributes['tcThree'];
            console.log('tcThree is set to ' +tcThree+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[tcThree].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[tcThree].Meaning;
            
            sessionAttributes['scTitle'] = 'The Future';
            
            sessionAttributes['scSSML'] = '<speak>The future. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[tcThree].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "tc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
    
    } else if (sessionAttributes['screen'] == "cc") {
        
        console.log("ElementSelected firing from CC screen. ");
        
        // IF SELECT SCREEN WAS cc, MAP selectedToken TO CORRECT SESSION ATTRIBUTE VALUE TO POPULATE SCREEN.
        // RECALL THAT ccOne - ccTen ARE THE INDICES STORED TO SESSION ATTRIBUTES FOR A CELTIC CROSS CARD READING. 
        
            if (selectedToken == 1) {
                
            var ccOne = sessionAttributes['ccOne'];
            console.log('ccOne is set to ' +ccOne+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccOne].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccOne].Meaning;
            
            sessionAttributes['scTitle'] = 'Current Situation';
            
            sessionAttributes['scSSML'] = '<speak>The current situation or concern. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccOne].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
                
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
                
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
    
    
        } else if (selectedToken == 2) {
            
            var ccTwo = sessionAttributes['ccTwo'];
            console.log('ccTwo is set to ' +ccTwo+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccTwo].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccTwo].Meaning;
            
            sessionAttributes['scTitle'] = 'Current Challenges';
            
            sessionAttributes['scSSML'] = '<speak>Obstacles or challenges you are experiencing. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccTwo].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else if (selectedToken == 3) {
            
            var ccThree = sessionAttributes['ccThree'];
            console.log('ccThree is set to ' +ccThree+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccThree].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccThree].Meaning;
            
            sessionAttributes['scTitle'] = 'What is Known';
            
            sessionAttributes['scSSML'] = '<speak>What you know objectively. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccThree].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 4) {
            
            var ccFour = sessionAttributes['ccFour'];
            console.log('ccFour is set to ' +ccFour+ '. ');
 
            sessionAttributes['scCardName'] = aryDeck[ccFour].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccFour].Meaning;
            
            sessionAttributes['scTitle'] = 'Past Influences in Effect';
            
            sessionAttributes['scSSML'] = '<speak>Past influences, still in effect. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccFour].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 5) {
            
            var ccFive = sessionAttributes['ccFive'];
            console.log('ccFive is set to ' +ccFive+ '. ');   
            
            sessionAttributes['scCardName'] = aryDeck[ccFive].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccFive].Meaning;
            
            sessionAttributes['scTitle'] = 'Past Influences, Fading';
            
            sessionAttributes['scSSML'] = '<speak>Past influences, now fading away. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccFive].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 6) {
            
            var ccSix = sessionAttributes['ccSix'];
            console.log('ccSix is set to ' +ccSix+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccSix].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccSix].Meaning;
            
            sessionAttributes['scTitle'] = 'The Near Future';
            
            sessionAttributes['scSSML'] = '<speak>The near future. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccSix].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 7) {
            
            var ccSeven = sessionAttributes['ccSeven'];
            console.log('ccSeven is set to ' +ccSeven+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccSeven].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccSeven].Meaning;
            
            sessionAttributes['scTitle'] = 'The Current State';
            
            sessionAttributes['scSSML'] = '<speak>Your current state of mind, or current factors in effect. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccSeven].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 8) {
            
            var ccEight = sessionAttributes['ccEight'];
            console.log('ccEight is set to ' +ccEight+ '. ');        
            
            sessionAttributes['scCardName'] = aryDeck[ccEight].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccEight].Meaning;
            
            sessionAttributes['scTitle'] = 'External Influences';
            
            sessionAttributes['scSSML'] = '<speak>External influences. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccEight].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 9) {
            
            var ccNine = sessionAttributes['ccNine'];
            console.log('ccNine is set to ' +ccNine+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccNine].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccNine].Meaning;
            
            sessionAttributes['scTitle'] = 'Hopes and Fears';
            
            sessionAttributes['scSSML'] = '<speak>Your hopes and fears. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccNine].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 10) {
            
            var ccTen = sessionAttributes['ccTen'];
            console.log('ccTen is set to ' +ccTen+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccTen].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccTen].Meaning;
            
            sessionAttributes['scTitle'] = 'Final Outcome';
            
            sessionAttributes['scSSML'] = '<speak>The final outcome. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccTen].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
        
    } else if (sessionAttributes['screen'] == "ma") { // MAJOR ARCANA (ma), LIST ITEM 1, HAS BEEN SELECTED FROM suits SCREEN
        
        console.log("ElementSelected firing from MA screen. ");
        
        var cardIndex = parseFloat(selectedToken) - 1; // MAJOR ARCANA INDICES START AT 0
        console.log('Selected cardIndex from MA screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "ma";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "wands") {
        
        console.log("ElementSelected firing from Wands screen. ");
        
        var cardIndex = parseFloat(selectedToken) + 43; // WANDS INDICES START AT 44
        console.log('Selected cardIndex from Wands screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "wands";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "cups") {
        
        console.log("ElementSelected firing from Cups screen. ");
        
        var cardIndex = parseFloat(selectedToken) + 71; // CUPS INDICES START AT 72
        console.log('Selected cardIndex from Cups screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "cups";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "swords") {
        
        console.log("ElementSelected firing from Swords screen. ");
        
        var cardIndex = parseFloat(selectedToken) + 99; // SWORDS INDICES START AT 100
        console.log('Selected cardIndex from Swords screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "swords";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "pentacles") {
        
        var cardIndex = parseFloat(selectedToken) + 127; // PENTACLES INDICES START AT 100
        console.log('Selected cardIndex from Swords screen is set to ' +cardIndex+ '. ');
        
        console.log("ElementSelected firing from Pentacles screen. ");
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "pentacles";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else {
        
        this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
    }
        
},
    
//==============================
// END ElementSelected FUNCTION
//==============================
    
    
    
//=======================================
// selectNumberIntent FUNCTION
//=======================================
    
// DUPLICATION OF ElementSelected LOGIC, TO HANDLE USER SELECTION
// BY LIST NUMBER SPOKEN ALOUD.
    
    
'selectNumberIntent': function () {
    console.log("selectNumberIntent is firing. ");
    
    var selectedToken = '';        
    selectedToken = this.event.request.intent.slots.ListNumber.value;
    console.log("selectedToken / ListNumber is " +selectedToken+ ". ");
    
    var sessionAttributes = {};
    sessionAttributes = this.attributes;
    
    console.log("sessionAttributes['screen'] value is set to " +sessionAttributes['screen']+ ". ");
    
    if (sessionAttributes['screen'] == "home") {
        
        console.log("selectNumberIntent firing from Home screen. ");

        //----------CARD ENCYCLOPEDIA OPTION SELECTED---------------
    
        if (selectedToken == 1) {
    
            console.log('Home screen selected token is 1: Show Encyclopedia. ');
            
            sessionAttributes['goback'] = "home";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['suitsSSML'] = '<speak>Select Major Arcana, or the suit you are interested in, by list number.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'suits';
            
            this.emit('showSuits');
 
        //-------RANDOM / 1 CARD READING SELECTED--------------------

        } else if (selectedToken == 2) {
            
            console.log('Home screen selected token is 2: One Card Reading. ');
        
            sessionAttributes['goback'] = "home";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'rc';
        
            this.emit('showRC');

        //------------THREE CARD READING SELECTED------------------
        
        } else if (selectedToken == 3) {
            
            console.log('Home screen selected token is 3: Three Card Reading. ');
            
            sessionAttributes['goback'] = "home";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['tcSSML'] = '<speak>Here is your three card reading, also known as a Past, Present and Future reading. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'tc';
            
            this.emit('showTC');
            
        //------------CC READING SELECTED----------------------------
        
        } else if (selectedToken == 4) {
            
            console.log('Home screen selected token is 4: Celtic Cross Reading. ');
            
            sessionAttributes['goback'] = "home";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['ccSSML'] = '<speak>Here is your Celtic Cross reading. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'cc';
            
            this.emit('showCC');
            
   
        //-------------NO VALID SELECTION DETECTED---------------------
            
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
    
    } else if (sessionAttributes['screen'] == "suits") {
        
        console.log("ElementSelected firing from Suits screen. ");
        
        //------------MAJOR ARCANA LIST SELECTED------------------
    
        if (selectedToken == 1) { 
            
            sessionAttributes['goback'] = "suits";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['maSSML'] = '<speak>Here are the cards in the Major Arcana. Select a card by list number.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'ma';
            
            this.emit('showMA');
            
        //-------------WANDS LIST SELECTED--------------------------
    
        } else if (selectedToken == 2) {
            
            sessionAttributes['goback'] = "suits";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['wandsSSML'] = '<speak>Here are the cards in the suit of Wands. Select a card by list number.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'wands';
            
            this.emit('showWands');
            
        //----------------CUPS LIST SELECTED------------------------
        
        } else if (selectedToken == 3) {
            
            sessionAttributes['goback'] = "suits";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['cupsSSML'] = '<speak>Here are the cards in the suit of Cups. Select a card by list number.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'cups';
            
            this.emit('showCups');
            
        //-------------SWORDS LIST SELECTED----------------------------
        
        } else if (selectedToken == 4) {
            
            sessionAttributes['goback'] = "suits";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['swordsSSML'] = '<speak>Here are the cards in the suit of Swords. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'swords';
            
            this.emit('showSwords');
            
        //------------PENTACLES LIST SELECTED-------------------------
        
        } else if (selectedToken == 5) {
            
            sessionAttributes['goback'] = "suits";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['pentaclesSSML'] = '<speak>Here are the cards in the suit of Pentacles. Select a card by list number to view its details.  Say go back to return to the previous screen.</speak>';
            
            sessionAttributes['screen'] = 'pentacles';
            
            this.emit('showPentacles');
            
        //----------NO VALID SELECTION DETECTED------------------------
        
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
    
    } else if (this.attributes['screen'] == "tc") {
        
        console.log("selectNumberIntent firing from TC screen. ");
        
        // IF SELECT SCREEN WAS tc, MAP selectedToken TO CORRECT CONTENT FOR 
        // EACH CARD IN THE READING
        
        if (selectedToken == 1) {
            
            var tcOne = sessionAttributes['tcOne'];
            console.log('tcOne is set to ' +tcOne+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[tcOne].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[tcOne].Meaning;
            
            sessionAttributes['scTitle'] = 'The Past';
            
            sessionAttributes['scSSML'] = '<speak>The past. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[tcOne].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            
            sessionAttributes['goback'] = "tc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
    
    
        } else if (selectedToken == 2) {
            
            var tcTwo = sessionAttributes['tcTwo'];
            console.log('tcTwo is set to ' +tcTwo+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[tcTwo].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[tcTwo].Meaning;
            
            sessionAttributes['scTitle'] = 'The Present';
            
            sessionAttributes['scSSML'] = '<speak>The present. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[tcTwo].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "tc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else if (selectedToken == 3) {
            
            var tcThree = sessionAttributes['tcThree'];
            console.log('tcThree is set to ' +tcThree+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[tcThree].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[tcThree].Meaning;
            
            sessionAttributes['scTitle'] = 'The Future';
            
            sessionAttributes['scSSML'] = '<speak>The future. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[tcThree].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "tc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
    
    } else if (sessionAttributes['screen'] == "cc") {
        
        console.log("selectNumberIntent firing from TC screen. ");
        
        // IF SELECT SCREEN WAS cc, MAP selectedToken TO CORRECT CONTENT FOR 
        // EACH CARD IN THE READING

        
            if (selectedToken == 1) {
                
            var ccOne = sessionAttributes['ccOne'];
            console.log('ccOne is set to ' +ccOne+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccOne].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccOne].Meaning;
            
            sessionAttributes['scTitle'] = 'Current Situation';
            
            sessionAttributes['scSSML'] = '<speak>The current situation or concern. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccOne].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
                
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
                
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
    
    
        } else if (selectedToken == 2) {
            
            var ccTwo = sessionAttributes['ccTwo'];
            console.log('ccTwo is set to ' +ccTwo+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccTwo].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccTwo].Meaning;
            
            sessionAttributes['scTitle'] = 'Current Challenges';
            
            sessionAttributes['scSSML'] = '<speak>Obstacles or challenges you are experiencing. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccTwo].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else if (selectedToken == 3) {
            
            var ccThree = sessionAttributes['ccThree'];
            console.log('ccThree is set to ' +ccThree+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccThree].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccThree].Meaning;
            
            sessionAttributes['scTitle'] = 'What is Known';
            
            sessionAttributes['scSSML'] = '<speak>What you know objectively. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccThree].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 4) {
            
            var ccFour = sessionAttributes['ccFour'];
            console.log('ccFour is set to ' +ccFour+ '. ');
 
            sessionAttributes['scCardName'] = aryDeck[ccFour].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccFour].Meaning;
            
            sessionAttributes['scTitle'] = 'Past Influences in Effect';
            
            sessionAttributes['scSSML'] = '<speak>Past influences, still in effect. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccFour].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 5) {
            
            var ccFive = sessionAttributes['ccFive'];
            console.log('ccFive is set to ' +ccFive+ '. ');   
            
            sessionAttributes['scCardName'] = aryDeck[ccFive].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccFive].Meaning;
            
            sessionAttributes['scTitle'] = 'Past Influences, Fading';
            
            sessionAttributes['scSSML'] = '<speak>Past influences, now fading away. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccFive].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 6) {
            
            var ccSix = sessionAttributes['ccSix'];
            console.log('ccSix is set to ' +ccSix+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccSix].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccSix].Meaning;
            
            sessionAttributes['scTitle'] = 'The Near Future';
            
            sessionAttributes['scSSML'] = '<speak>The near future. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccSix].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 7) {
            
            var ccSeven = sessionAttributes['ccSeven'];
            console.log('ccSeven is set to ' +ccSeven+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccSeven].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccSeven].Meaning;
            
            sessionAttributes['scTitle'] = 'The Current State';
            
            sessionAttributes['scSSML'] = '<speak>Your current state of mind, or current factors in effect. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccSeven].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 8) {
            
            var ccEight = sessionAttributes['ccEight'];
            console.log('ccEight is set to ' +ccEight+ '. ');        
            
            sessionAttributes['scCardName'] = aryDeck[ccEight].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccEight].Meaning;
            
            sessionAttributes['scTitle'] = 'External Influences';
            
            sessionAttributes['scSSML'] = '<speak>External influences. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccEight].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 9) {
            
            var ccNine = sessionAttributes['ccNine'];
            console.log('ccNine is set to ' +ccNine+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccNine].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccNine].Meaning;
            
            sessionAttributes['scTitle'] = 'Hopes and Fears';
            
            sessionAttributes['scSSML'] = '<speak>Your hopes and fears. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccNine].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
            
        } else if (selectedToken == 10) {
            
            var ccTen = sessionAttributes['ccTen'];
            console.log('ccTen is set to ' +ccTen+ '. ');
            
            sessionAttributes['scCardName'] = aryDeck[ccTen].CardName;
            
            sessionAttributes['scMeaning'] = aryDeck[ccTen].Meaning;
            
            sessionAttributes['scTitle'] = 'Final Outcome';
            
            sessionAttributes['scSSML'] = '<speak>The final outcome. The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
            sessionAttributes['scImageURL'] = aryDeck[ccTen].lgImg;
            sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
            
            sessionAttributes['goback'] = "cc";            
            console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
            
            sessionAttributes['screen'] = 'sc';
            
            this.emit('showSC');
        
        } else {
            this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
        }
        
    } else if (sessionAttributes['screen'] == "ma") {
        
        console.log("ElementSelected firing from MA screen. ");
        
        var cardIndex = parseFloat(selectedToken) - 1; // MAJOR ARCANA INDICES START AT 0
        console.log('Selected cardIndex from MA screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "ma";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "wands") {
        
        console.log("ElementSelected firing from Wands screen. ");
        
        var cardIndex = parseFloat(selectedToken) + 43; // WANDS INDICES START AT 44
        console.log('Selected cardIndex from Wands screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "wands";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "cups") {
        
        console.log("ElementSelected firing from Cups screen. ");
        
        var cardIndex = parseFloat(selectedToken) + 71; // CUPS INDICES START AT 72
        console.log('Selected cardIndex from Cups screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "cups";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "swords") {
        
        console.log("ElementSelected firing from Swords screen. ");
        
        var cardIndex = parseFloat(selectedToken) + 99; // SWORDS INDICES START AT 100
        console.log('Selected cardIndex from Swords screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "swords";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else if (sessionAttributes['screen'] == "pentacles") {
        
        console.log("ElementSelected firing from Pentacles screen. ");
        
        var cardIndex = parseFloat(selectedToken) + 127; // PENTACLES INDICES START AT 128
        console.log('Selected cardIndex from Swords screen is set to ' +cardIndex+ '. ');
        
        sessionAttributes['scCardName'] = aryDeck[cardIndex].CardName;
            
        sessionAttributes['scMeaning'] = aryDeck[cardIndex].Meaning;
            
        sessionAttributes['scTitle'] = 'Card Detail View';
            
        sessionAttributes['scSSML'] = '<speak>The selected card is ' + sessionAttributes['scCardName'] + '.  ' + sessionAttributes['scMeaning'] + ' Say go back to return to the previous screen. </speak>';
            
        sessionAttributes['scImageURL'] = aryDeck[cardIndex].lgImg;
        sessionAttributes['scImageDesc'] = sessionAttributes['scCardName'] + 'Tarot card. ';
        
        sessionAttributes['goback'] = "pentacles";            
        console.log("this.attributes['goback'] is set to " +sessionAttributes['goback']+ ". ");
        
        sessionAttributes['screen'] = 'sc';
            
        this.emit('showSC');
    
    } else {
        
        this.emit(':ask', "Sorry, I didn't detect a valid selection.", REPROMPT_MESSAGE);
        
    }
        
},
    
//==============================
// END selectNumberIntent FUNCTION
//==============================
  
    
//=================================
// AMAZON.PreviousIntent FUNCTION
//=================================
    
// FOR WHEN USER WANTS TO RETURN TO PREVIOUS SCREEN.
// REFERENCES goback SESSION ATTRIBUTE THAT'S SET IN
// ElementSelected AND selectNumberIntent FUNCTIONS ABOVE.
//
// NOTE THAT WITHOUT A DEFINED HANDLER FOR AMAZON.PreviousIntent, 
// backButton VALUES ON TEMPLATES COULD BE SET TO 'VISIBLE' AND THEY
// WOULD FUNCTION WITHOUT ANY CUSTOM CODING AT ALL. THIS SEEMS TO
// BE SOME KIND OF DEFAULT AMAZON.PreviousIntent BEHAVIOR IN 
// DISPLAY TEMPLATE SKILLS. 
    
// HOWEVER, BECAUSE backButton DOESN'T TRACK USER 'LOCATION' IN THE 
// SKILL IT DOESN'T RELIABLY RE-LOAD THE SCREEN THE USER JUST CAME FROM.
// FOR THAT, A CUSTOM AMAZON.PreviousIntent HAD TO BE WRITTEN, BUT
// DOING SO INTRODUCES A NEW PROBLEM.
// 
// THIS FUNCTION CANNOT EXPLICITLY REFERENCE THE backButton
// LINK ON ANY SCREEN TO CONTROL ITS BEHAVIOR BECAUSE THE
// backButton LINK IS NOT A NAMED OBJECT THAT'S EXPOSED TO 
// THE DEVELOPER. FOR THIS REASON, ALL backButton LINKS 
// ARE SET TO 'HIDDEN' IN THIS SKILL, AND THE USER IS VERBALLY
// INSTRUCTED TO 'Say go back to return to the previous screen."
    
'AMAZON.PreviousIntent' : function() {
    
    console.log("AMAZON.PreviousIntent is firing. ");  
        
    var sessionAttributes = {};
        
    sessionAttributes = this.attributes; 
     
    var gbScreen = sessionAttributes['goback']; 
     
    console.log("gbScreen value is " +gbScreen+ ". ");
     
    if (gbScreen == "home") {
        sessionAttributes['homeSSML'] = ''; // SINCE USER IS RETURNING TO SCREEN, DON'T REPEAT 
                                            // WELCOME SPEECH USER HAS ALREADY HEARD
        
        sessionAttributes['screen'] = 'home';
        this.emit('showHome'); 
        
    } else if (gbScreen == "suits") {
        sessionAttributes['suitsSSML'] = '';
        sessionAttributes['screen'] = 'suits';
        sessionAttributes['goback'] = 'home';
        this.emit('showSuits');        
    
    } else if (gbScreen == "ma") {
        sessionAttributes['maSSML'] = '';
        sessionAttributes['screen'] = 'ma';
        sessionAttributes['goback'] = 'suits';
        this.emit('showMA');        
    
    } else if (gbScreen == "wands") {
        sessionAttributes['wandsSSML'] = '';
        sessionAttributes['screen'] = 'wands';
        sessionAttributes['goback'] = 'suits';
        this.emit('showWands');        
    
    } else if (gbScreen == "cups") {
        sessionAttributes['cupsSSML'] = '';
        sessionAttributes['screen'] = 'cups';
        sessionAttributes['goback'] = 'suits';
        this.emit('showCups');        
    
    } else if (gbScreen == "swords") {
        sessionAttributes['swordsSSML'] = '';
        sessionAttributes['screen'] = 'swords';
        sessionAttributes['goback'] = 'suits';
        this.emit('showSwords');
        
    } else if (gbScreen == "pentacles") {
        sessionAttributes['pentaclesSSML'] = '';
        sessionAttributes['screen'] = 'pentacles';
        sessionAttributes['goback'] = 'suits';
        this.emit('showPentacles');        
    
    } else if (gbScreen == "tc") {
        sessionAttributes['tcSSML'] = '';
        sessionAttributes['screen'] = 'tc';
        sessionAttributes['goback'] = 'home';
        this.emit('showTC');        
    
    } else if (gbScreen == "cc") {
        sessionAttributes['ccSSML'] = '';
        sessionAttributes['screen'] = 'cc';
        sessionAttributes['goback'] = 'home';
        this.emit('showCC');        
    
    } else {
        
        this.emit(':ask', "Sorry, there was a problem handling your selection. Please try again. ", REPROMPT_MESSAGE);
        
    }  
     
 },
    
    
//=============================
// END goBackIntent FUNCTION
//=============================
    
    
//==============================
// showHome FUNCTION
//==============================    
    
    'showHome': function (contentHome) { // DISPLAYS HOME SCREEN / MAIN MENU 
        console.log("Active function is showHome. ");
        
        var sessionAttributes = {};
        
        sessionAttributes = this.attributes; // PULL IN SESSION ATTRIBUTES

        console.log('In showHome function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
        
        if(supportsDisplay.call(this)||isSimulator.call(this)) { // VERIFY DEVICE HAS A DISPLAY
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
            
            var contentHome = {
             
             "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['homeSSML'] // NOT HARD-CODED, SO THAT SPEECH CAN BE BLANKED OUT WHEN
                                                          // USER RETURNS TO THIS SCREEN. SAME ON ALL SCREENS.
                    }
            };
            
            var response = {
              "version": '1.0',
              "response": {
                "outputSpeech": contentHome.outputSpeech, 
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": "ShowHomeView",
                        "backButton": 'HIDDEN', //**BACK BUTTON HIDDEN BECAUSE THIS IS THE HOME SCREEN
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
                        
                        "title": 'Visual Tarot: Home', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [
                                {
                                "token": 1, // CARD ENCYCLOPEDIA SCREEN
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/screen_icons/ShowDeckSelect192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'grid of Tarot card images' // METADATA, NOT SEEN BY USER
                                                                                      // OR REFERENCED BY CODE
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Card Encyclopedia'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 2, // RANDOM CARD / SINGLE CARD READING SCREEN
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/screen_icons/SingleCardSelect192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'single face down Tarot card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'One Card Reading'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 3, // THREE CARD READING SCREEN
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/screen_icons/ThreeCardSelect192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'three face down Tarot cards'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Past, Present and Future'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 4, // CC READING SCREEN
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/screen_icons/CCSelect192x280.png'
                                        }
                                        ],
                                    "contentDescription": ' Celtic Cross Tarot spread'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Celtic Cross'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            ],  
                                               
                    },
                },
                    
                {
                "type": 'Hint',
                    "hint": {
                        "type": 'PlainText',
                        "text": ' select number one. '
                        }
                }
                    
                ],
                
                "shouldEndSession": contentHome.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
            
           this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log('Home screen unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
},
    
//==============================
// END showHome FUNCTION
//==============================
    
    
//===============================================
// showSuits (ENCYCLOPEDIA SCREEN) FUNCTION
//===============================================
    
    'showSuits' : function () {  
                
        if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
            
            console.log ("showSuits -Card Encyclopedia- is firing. ");
            
            var sessionAttributes = {};
        
            sessionAttributes = this.attributes;

            console.log('In showSuits function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
            
            var contentSuits = {
             
             "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['suitsSSML']
                    }
            };
    
           var response = {
              "version": '1.0',
              "response": {
                  
                "outputSpeech": contentSuits.outputSpeech,  
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": 'showCardEncyclopedia', // IDENTIFIES THIS SCREEN
                        "backButton": 'HIDDEN',
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
                        
                        "title": 'Visual Tarot: Card Encyclopedia', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/small_images/World192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'The World Tarot card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Major Arcana'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/small_images/AceWands192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'The Ace of Wands Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Wands'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/small_images/AceCups192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'The Ace of Cups Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Cups'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 4,
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/small_images/AceSwords192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'The Ace of Swords Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Swords'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 5,
                                "image": {
                                    "sources": [
                                        {
                                        "url": 'https://[full path goes here]/small_images/AcePentacles192x280.png'
                                        }
                                        ],
                                    "contentDescription": 'The Ace of Pentacles Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Pentacles'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": 'Hint',
                    "hint": {
                        "type": 'PlainText',
                        "text": ' show number two. '
                        }
                }
                    
                ],
                
                "shouldEndSession": contentSuits.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
            
           this.context.succeed(response);
            
        } else {
            
            // Message if user tries to use Visual Tarot on a device without a screen.
            console.log('showSuits unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
}, 

//====================================================
//   END showSuits (ENCYCLOPEDIA) FUNCTION
//====================================================
    
    
    
//===============================================
// showMA FUNCTION - MAJOR ARCANA LIST SCREEN
//===============================================
    
    'showMA' : function () { 
        if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
            
            console.log("showMA -Major Arcana Screen- is firing. ");
            
            var sessionAttributes = {};
        
            sessionAttributes = this.attributes;

            console.log('In showMA function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
            
            var contentMA = {
            
                "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['maSSML']
                    }
            };
           
           var response = {
              "version": '1.0',
              "response": {
                  
                "outputSpeech": contentMA.outputSpeech,  
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": 'showMajorArcanaView',
                        "backButton": 'HIDDEN', // USER IS INSTRUCTED IN WELCOME MESSAGE TO "Say go back
                                                // to return to the previous screen."
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
                        
                        "title": 'Visual Tarot: Major Arcana', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [                            
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[0].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[0].CardName + ' Tarot Card' // MAJOR ARCANA CARDS OCCUR FIRST IN aryDeck,
                                                                                              // BEGINNING AT INDEX 0, SO THEIR INDICES CAN
                                                                                              // BE REFERENCED DIRECTLY & IN ORDER.
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[0].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[1].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[1].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[1].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }, 
                                                                                  
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[2].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[2].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[2].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 4,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[3].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[3].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[3].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 5,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[4].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[4].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[4].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 6,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[5].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[5].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[5].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 7,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[6].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[6].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[6].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 8,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[7].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[7].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[7].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 9,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[8].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[8].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[8].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 10,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[9].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[9].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[9].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 11,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[10].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[10].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[10].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 12,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[11].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[11].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[11].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 13,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[12].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[12].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[12].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 14,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[13].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[13].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[13].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                            
                                {
                                "token": 15,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[14].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[14].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[14].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 16,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[15].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[15].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[15].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 17,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[16].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[16].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[16].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 18,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[17].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[17].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[17].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 19,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[18].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[18].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[18].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 20,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[19].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[19].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[19].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 21,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[20].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[20].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[20].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 22,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[21].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[21].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[21].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 23,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[22].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[22].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[22].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 24,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[23].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[23].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[23].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 25,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[24].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[24].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[24].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 26,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[25].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[25].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[25].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 27,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[26].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[26].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[26].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 28,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[27].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[27].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[27].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 29,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[28].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[28].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[28].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 30,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[29].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[29].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[29].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 31,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[30].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[30].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[30].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 32,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[31].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[31].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[31].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 33,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[32].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[32].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[32].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 34,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[33].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[33].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[33].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 35,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[34].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[34].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[34].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 36,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[35].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[35].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[35].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 37,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[36].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[36].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[36].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 38,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[37].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[37].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[37].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 39,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[38].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[38].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[38].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 40,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[39].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[39].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[39].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 41,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[40].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[40].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[40].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 42,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[41].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[41].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[41].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 43,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[42].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[42].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[42].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 44,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[43].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[43].CardName + ' Tarot Card'
                                    },                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[43].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                } 
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": "Hint",
                "hint": {
                        "type": "PlainText",
                        "text": " select number eleven. "
                        }
                }
                    
                ],
                
                "shouldEndSession": contentMA.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           
           this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log('showMA unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
},
    
    
    
//====================================================
//   END showMA FUNCTION
//====================================================

    
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//&&&&&&&&& SHOW READING SCREEN FUNCTIONS &&&&&&&&&&&&
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& 
    
    
//======================================
// showRC --SELECTED CARD-- Function
//======================================
    
    'showRC' : function () {        
        
        console.log("showRC -Random Card- is firing. ");
        
        var sessionAttributes = {};        
        sessionAttributes = this.attributes;
        
        console.log('In showRC function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
        
        var rc = sessionAttributes['rc'];            
        console.log("rc -aryDeck index- value is " +rc+ ". ");
        
        var contentRC = {
            
                "outputSpeech": {
                "type": 'SSML',
                "ssml": '<speak>Here is your one card reading. The selected card is ' + aryDeck[rc].CardName + '.  ' + aryDeck[rc].Meaning + ' Say go back to return to the previous screen. </speak>'
                }
            };
        
            var response = {
              "version": '1.0',
              "response": {
                  
                "outputSpeech": contentRC.outputSpeech,  
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                    "template": {
                        "type": 'BodyTemplate2',
                        "token": "showSelectedCardView",
                        "backButton": 'HIDDEN',
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png' 
                                    }
                                ],
                        },
                        
                        "title": 'Visual Tarot: One Card Reading', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "image": {
                        "sources": [
                                {
                                "url": aryDeck[rc].smImg
                                }
                            ],
                        "contentDescription": aryDeck[rc].CardName + 'Tarot card. '
                        },
                         
                        "textContent": {
                            "primaryText": {
                                "type": "PlainText",
                                "text": aryDeck[rc].CardName + '. '
                                },
                            "secondaryText": {
                                "type": "PlainText",
                                "text": aryDeck[rc].Meaning
                                },
                            "tertiaryText": {
                                "type": 'RichText',
                                "text": ''
                                }
                        }  
                                               
                    },
                }
                    
                ],
                
                "shouldEndSession": contentRC.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           this.context.succeed(response);
},    

//======================================
// END showRC FUNCTION
//======================================
    

//======================================
// showSC --SELECTED CARD-- Function
//======================================
    
    'showSC' : function () { // CARD DETAIL VIEW SCREEN, FOR WHEN USER HAS DRILLED DOWN 
                             // BY SELECTING A CARD FROM A READING, MAJOR ARCANA OR SUIT LIST SCREEN 
        
        console.log("showSC -SelectedCard- is firing. ");
        
        var sessionAttributes = {};
        sessionAttributes = this.attributes;
        
        console.log('In showSC function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
        
        console.log('sessionAttributes.goback is currently set to ' +sessionAttributes['goback']+ '. ');
        
        var contentSC = {
            
                "outputSpeech": {
                "type": 'SSML',
                "ssml": sessionAttributes['scSSML']
                }
            };
        
        var response = {
              "version": '1.0',
              "response": {
                  
                "outputSpeech": contentSC.outputSpeech,  
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                    "template": {
                        "type": 'BodyTemplate2',
                        "token": "showSelectedCardView",
                        "backButton": 'HIDDEN',
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png' 
                                    }
                                ],
                        },
                        
                        "title": sessionAttributes['scTitle'], //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "image": {
                        "sources": [
                                {
                                "url": sessionAttributes['scImageURL']
                                }
                            ],
                        "contentDescription": sessionAttributes['scCardName'] + 'Tarot card. '
                        },
                         
                        "textContent": {
                            "primaryText": {
                                "type": "PlainText",
                                "text": sessionAttributes['scCardName'] + '. '
                                },
                            "secondaryText": {
                                "type": "PlainText",
                                "text": sessionAttributes['scMeaning']
                                },
                            "tertiaryText": {
                                "type": 'RichText',
                                "text": ''
                                }
                        }  
                                               
                    },
                }
                    
                ],
                
                "shouldEndSession": contentSC.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           this.context.succeed(response);
},    

//======================================
// END showSC FUNCTION
//======================================
    

    
//===============================================
// showTC (THREE CARD) READING FUNCTION
//===============================================
    
    'showTC' : function () {
                
        if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
        
        console.log("showTC -ThreeCardReading- is firing. ");
            
        var sessionAttributes = {};
            
        sessionAttributes = this.attributes;
            
        console.log('In showTC function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
            
        var tcOne = sessionAttributes['tcOne']; 
        var tcTwo = sessionAttributes['tcTwo'];
        var tcThree = sessionAttributes['tcThree'];
             
        var contentTC = {
            
            "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['tcSSML']
                    }
            }; 
    
           var response = {
              "version": '1.0',
              "response": {
                  
                "outputSpeech": contentTC.outputSpeech,
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": "show3CardViewTemplateToken",
                        "backButton": 'HIDDEN', 
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
                        
                        "title": 'Visual Tarot: Past, Present and Future', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[tcOne].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[tcOne].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'The Past'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": '' // aryDeck[tcOne].CardName 
                                                   // CARD NAME COULD OPTIONALLY BE INCLUDED HERE,
                                                   // DEPENDING ON TEMPLATE IN USE AND DEVELOPER PREFERENCE.
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[tcTwo].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[tcTwo].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'The Present'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[tcTwo].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[tcThree].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[tcThree].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'The Future'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[tcThree].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": "Hint",
                "hint": {
                        "type": "PlainText",
                        "text": " select number three. "
                        }
                }
                    
                ],
                
                "shouldEndSession": contentTC.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
        
           this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log("showTC unsupported device message firing. ");
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
},    

//====================================================
//   END showTC (3 CARD READING) FUNCTION
//====================================================
    
  
    
//===============================================
// showCC FUNCTION
//===============================================
    
    'showCC' : function () {
        console.log("showCC is firing. ");
        
        if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
        
        console.log("showCC -Celtic Cross reading- is firing. ");
            
        var sessionAttributes = {};
            
        sessionAttributes = this.attributes;
 
        console.log('In showSuits function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
            
        var ccOne = sessionAttributes['ccOne']; 
        var ccTwo = sessionAttributes['ccTwo'];
        var ccThree = sessionAttributes['ccThree'];
        var ccFour = sessionAttributes['ccFour'];
        var ccFive = sessionAttributes['ccFive'];
        var ccSix = sessionAttributes['ccSix'];
        var ccSeven = sessionAttributes['ccSeven'];
        var ccEight = sessionAttributes['ccEight'];
        var ccNine = sessionAttributes['ccNine'];
        var ccTen = sessionAttributes['ccTen'];
            
          var contentCC = {
             
             "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['ccSSML']
                    }
            };
        
    
           var response = {
              "version": '1.0',
              "response": {
                  
                "outputSpeech": contentCC.outputSpeech,
                  
                "directives": [
                  {                    
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": "showCCViewTemplateToken",
                        "backButton": 'HIDDEN',  
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
                        
                        "title": 'Visual Tarot: Celtic Cross Reading', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccOne].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccOne].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'The Current Situation'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": '' //aryDeck[ccOne].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccTwo].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccTwo].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Current Challenges'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccTwo].CardName
                                        },
                                    "tertiaryText": {
                                        "type": "PlainText",
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccThree].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccThree].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'What Is Known Objectively'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccThree].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 4,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccFour].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccFour].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Past Influences, Still In Effect'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccFour].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 5,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccFive].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccFive].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Past Influences, Fading'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccFive].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 6,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccSix].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccSix].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Near Future'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccSix].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 7,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccSeven].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccSeven].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Your State of Mind'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccSeven].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 8,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccEight].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccEight].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'External Influences'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccEight].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 9,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccNine].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccNine].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Your Hopes and Fears'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccNine].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 10,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[ccTen].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[ccTen].CardName
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'PlainText',
                                        "text": 'Final Outcome'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''  //aryDeck[ccTen].CardName
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": "Hint",
                "hint": {
                        "type": "PlainText",
                        "text": " select number three. "
                        }
                }
                    
                ],
                
                "shouldEndSession": contentCC.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           
          this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log('showCC unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
},

//====================================================
//   END showCC FUNCTION
//====================================================
    
    
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//&&&&&&& END SHOW READING SCREEN FUNCTIONS &&&&&&&&&&
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    
    
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
//[[[[[[[[[[ SHOW SUIT LISTS FUNCTIONS [[[[[[[[[[[[[[[
//[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
    
    
    
    
//===================================================
// showWands FUNCTION
//===================================================
        
   'showWands' : function () {
       
       if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
            
            console.log("showWands function is firing. ");
           
            var sessionAttributes = {};
            
            sessionAttributes = this.attributes;
           
            console.log('In showWands function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
           
        var contentWands = {
            
                "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['wandsSSML']
                    }
            };
       
       
        var response = {
              "version": '1.0',
              "response": {
            
                "outputSpeech": contentWands.outputSpeech,
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": 'showWandsView',
                        "backButton": 'HIDDEN',  
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
             
                    "title": 'Visual Tarot: The Suit of Wands', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [                            
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[44].smImg // WANDS SUIT CARDS OCCUR SECOND IN aryDeck,
                                                                 // BEGINNING AT INDEX 44, SO THEIR INDICES CAN
                                                                 // BE REFERENCED DIRECTLY & IN ORDER BEGINNING
                                                                 // FROM THAT INDEX NUMBER.
                                        }
                                        ],
                                    "contentDescription": aryDeck[44].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[44].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[45].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[45].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[45].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                                                      
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[46].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[46].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[46].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 4,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[47].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[47].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[47].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 5,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[48].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[48].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[48].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 6,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[49].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[49].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[49].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 7,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[50].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[50].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[50].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 8,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[51].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[51].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[51].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 9,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[52].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[52].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[52].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 10,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[53].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[53].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[53].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 11,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[54].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[54].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[54].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 12,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[55].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[55].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[55].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 13,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[56].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[56].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[56].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 14,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[57].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[57].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[57].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 15,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[58].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[58].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[58].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 16,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[59].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[59].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[59].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 17,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[60].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[60].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[60].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 18,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[61].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[61].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[61].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 19,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[62].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[62].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[62].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 20,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[63].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[63].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[63].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 21,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[64].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[64].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[64].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 22,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[65].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[65].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[65].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 23,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[66].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[66].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[66].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 24,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[67].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[67].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[67].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 25,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[68].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[68].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[68].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 26,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[69].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[69].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[69].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 27,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[70].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[70].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[70].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 28,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[71].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[71].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[71].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": "Hint",
                "hint": {
                        "type": "PlainText",
                        "text": " select number six. "
                        }
                }
                    
                ],
                
                "shouldEndSession": contentWands.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           
           this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log('showWands unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
},
        
        
        
//===================================================
// END showWands FUNCTION
//===================================================
        

        
//===================================================
// showCups FUNCTION
//===================================================
        
   'showCups' : function () {
       
        if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
            
            console.log("showCups function is firing. ");
            
            var sessionAttributes = {};
            
            sessionAttributes = this.attributes;
            
            console.log('In showCups function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
        
        var contentCups = {
            
                "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['cupsSSML']
                    }
            };
       
       
        var response = {
              "version": '1.0',
              "response": {
            
                "outputSpeech": contentCups.outputSpeech,
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": 'showCupsView',
                        "backButton": 'HIDDEN',  
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
             
                    "title": 'Visual Tarot: The Suit of Cups', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [                            
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[72].smImg // CUPS SUIT CARDS OCCUR THIRD IN aryDeck,
                                                                 // BEGINNING AT INDEX 72, SO THEIR INDICES CAN
                                                                 // BE REFERENCED DIRECTLY & IN ORDER BEGINNING
                                                                 // FROM THAT INDEX NUMBER.
                                        }
                                        ],
                                    "contentDescription": aryDeck[72].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[72].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[73].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[73].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[73].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                                                      
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[74].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[74].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[74].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 4,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[75].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[75].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[75].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 5,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[76].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[76].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[76].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 6,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[77].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[77].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[77].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 7,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[78].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[78].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[78].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 8,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[79].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[79].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[79].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 9,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[80].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[80].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[80].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 10,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[81].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[81].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[81].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 11,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[82].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[82].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[82].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 12,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[83].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[83].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[83].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 13,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[84].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[84].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[84].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 14,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[85].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[85].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[85].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 15,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[86].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[86].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[86].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 16,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[87].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[87].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[87].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 17,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[88].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[88].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[88].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 18,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[89].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[89].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[89].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 19,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[90].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[90].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[90].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 20,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[91].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[91].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[91].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 21,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[92].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[92].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[92].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 22,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[93].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[93].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[93].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 23,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[94].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[94].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[94].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 24,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[95].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[95].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[95].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 25,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[96].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[96].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[96].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 26,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[97].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[97].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[97].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 27,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[98].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[98].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[98].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 28,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[99].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[99].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[99].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": "Hint",
                "hint": {
                        "type": "PlainText",
                        "text": " select number four. "
                        }
                }
                    
                ],
                
                "shouldEndSession": contentCups.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           
           this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log('showCups unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
},
        
        
        
//===================================================
// END showCups FUNCTION
//===================================================
        
        
 
    
//===============================================
// showSwords FUNCTION
//===============================================
    
    'showSwords' : function () {
        if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
            
            console.log("showSwords function is firing. ");
            
            var sessionAttributes = {};
            
            sessionAttributes = this.attributes;
            
            console.log('In showSwords function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
            
           
        var contentSwords = {
            
                "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['swordsSSML']
                    }
            };
       
       
        var response = {
              "version": '1.0',
              "response": {
            
                "outputSpeech": contentSwords.outputSpeech,
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": 'showSwordsView',
                        "backButton": 'HIDDEN',  
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
             
                    "title": 'Visual Tarot: The Suit of Swords', //** TITLE SHOWN TO USER ON-SCREEN
                        
                        "listItems": [                            
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[100].smImg  // SWORDS SUIT CARDS OCCUR THIRD IN aryDeck,
                                                                   // BEGINNING AT INDEX 100, SO THEIR INDICES CAN
                                                                   // BE REFERENCED DIRECTLY & IN ORDER BEGINNING
                                                                   // FROM THAT INDEX NUMBER.
                                        }
                                        ],
                                    "contentDescription": aryDeck[100].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[100].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[101].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[101].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[101].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                                                      
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[102].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[102].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[102].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 4,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[103].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[103].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[103].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 5,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[104].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[104].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[104].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 6,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[105].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[105].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[105].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 7,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[106].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[106].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[106].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 8,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[107].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[107].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[107].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 9,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[108].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[108].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[108].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 10,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[109].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[109].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[109].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 11,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[110].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[110].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[110].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 12,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[111].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[111].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[111].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 13,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[112].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[112].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[112].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 14,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[113].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[113].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[113].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 15,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[114].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[114].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[114].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 16,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[115].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[115].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[115].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 17,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[116].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[116].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[116].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 18,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[117].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[117].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[117].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 19,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[118].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[118].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[118].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 20,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[119].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[119].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[119].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 21,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[120].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[120].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[120].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 22,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[121].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[121].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[121].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 23,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[122].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[122].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[122].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 24,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[123].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[123].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[123].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 25,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[124].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[124].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[124].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 26,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[125].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[125].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[125].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 27,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[126].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[126].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[126].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 28,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[127].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[127].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[127].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": "Hint",
                "hint": {
                        "type": "PlainText",
                        "text": " select number two. "
                        }
                }
                    
                ],
                
                "shouldEndSession": contentSwords.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           
           this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log('showSwords unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
                    
},
                    
//====================================================
//   END showSwordsIntent FUNCTION
//====================================================
    
    
       
//===============================================
// showPentacles FUNCTION
//===============================================
    
    'showPentacles' : function () {
                    
        if(supportsDisplay.call(this)||isSimulator.call(this)) {
            console.log("has display:"+ supportsDisplay.call(this));
            console.log("is simulator:"+isSimulator.call(this));
            
            console.log("showPentacles function is firing. ");
            
            var sessionAttributes = {};
            
            sessionAttributes = this.attributes;
            
            console.log('In showPentacles function, sessionAttributes.screen set to ' +sessionAttributes['screen']+ '. ');
           
        var contentPentacles = {
            
                "outputSpeech": {
                    "type": 'SSML',
                    "ssml": sessionAttributes['pentaclesSSML']
                    }
            };
       
       
        var response = {
              "version": '1.0',
              "response": {
            
                "outputSpeech": contentPentacles.outputSpeech,
                  
                "directives": [
                  {
                    "type": 'Display.RenderTemplate',
                      
                    "template": {
                        "type": 'ListTemplate2',
                        "token": 'showPentaclesView',
                        "backButton": 'HIDDEN',  
                        
                        "backgroundImage": {
                                "contentDescription": 'ombre velvet background',
                                "sources": [
                                    {
                                    "url": 'https://[full path goes here]/background/CardsBackground1024x600.png'
                                    }
                                ],
                        },
             
                    "title": 'Visual Tarot: The Suit of Pentacles', //** TITLE SHOWN TO USER ON-SCREEN
                        
                    "listItems": [                            
                                {
                                "token": 1,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[128].smImg  // PENTACLES SUIT CARDS OCCUR THIRD IN aryDeck,
                                                                   // BEGINNING AT INDEX 128, SO THEIR INDICES CAN
                                                                   // BE REFERENCED DIRECTLY & IN ORDER BEGINNING
                                                                   // FROM THAT INDEX NUMBER.
                                        }
                                        ],
                                    "contentDescription": aryDeck[128].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[128].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 2,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[129].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[129].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[129].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                                                      
                                {
                                "token": 3,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[130].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[130].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[130].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 4,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[131].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[131].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[131].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 5,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[132].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[132].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[132].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 6,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[133].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[133].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[133].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 7,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[134].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[134].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[134].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 8,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[135].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[135].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[135].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 9,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[136].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[136].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[136].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 10,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[137].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[137].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[137].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 11,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[138].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[138].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[138].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 12,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[139].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[139].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[139].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 13,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[140].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[140].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[140].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 14,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[141].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[141].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[141].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 15,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[142].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[142].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[142].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 16,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[143].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[143].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[143].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 17,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[144].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[144].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[144].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 18,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[145].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[145].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[145].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 19,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[146].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[146].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[146].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 20,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[147].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[147].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[147].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 21,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[148].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[148].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[148].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 22,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[149].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[149].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[149].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 23,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[150].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[150].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[150].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 24,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[151].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[151].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[151].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 25,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[152].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[152].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[152].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 26,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[153].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[153].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[153].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                                {
                                "token": 27,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[154].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[154].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[154].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                },
                            
                            {
                                "token": 28,
                                "image": {
                                    "sources": [
                                        {
                                        "url": aryDeck[155].smImg
                                        }
                                        ],
                                    "contentDescription": aryDeck[155].CardName + ' Tarot Card'
                                    },
                                    
                                "textContent": {
                                    "primaryText": {
                                        "type": 'RichText',
                                        "text": '<font size="2">' + aryDeck[155].CardName + '</font>'
                                        },
                                    "secondaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        },
                                    "tertiaryText": {
                                        "type": 'PlainText',
                                        "text": ''
                                        }
                                    }
                                }
                            
                            ],  
                                               
                    },
                },
                    
                {
                "type": "Hint",
                "hint": {
                        "type": "PlainText",
                        "text": " select number two. "
                        }
                }
                    
                ],
                
                "shouldEndSession": contentPentacles.askOrTell== ":tell",
              },
            
            "sessionAttributes": this.attributes
           };
           
           this.context.succeed(response);

        } else {
            
            // MESSAGE IF USER DEVICE HAS NO SCREEN
            console.log('showPentacles unsupported device message firing. ');
            this.emit(':tell', 'Sorry, Visual Tarot is not supported on this device.');
        }
                    
},

//====================================================
//   END showPentacles FUNCTION
//====================================================
    
        
    


//===================================
// FUNCTIONS FOR MISC AMAZON 
// STANDARD INTENTS
//=================================== 
         
    'AMAZON.HelpIntent': function() {
        console.log("AMAZON.HelpIntent firing. ");
        this.emit(":ask", HELP_MESSAGE, REPROMPT_MESSAGE);
    },        
    
    'AMAZON.CancelIntent': function() {
        console.log("AMAZON.CancelIntent firing. ");
        this.response.speak('Come back to explore the Tarot any time. Say the wake word followed by Go Home to return to your device home screen. ');
        this.emit(':responseReady');
    },
      
   'AMAZON.StopIntent': function() {
       console.log("AMAZON.StopIntent firing. ");
       this.response.speak('Come back to explore the Tarot any time. Say the wake word followed by Go Home to return to your device home screen. ');
       this.emit(':responseReady');
    },
    
    
//=====================================
// SessionEndedRequest FUNCTION
//=====================================
    
'SessionEndedRequest': function () { // BLANK OUT ALL SESSION ATTRIBUTES TO 
                                     // AVOID LAMBDA LATENCY ISSUES & ENSURE
                                     // USER GETS FRESH READINGS WITH EVERY SESSION.
    
    console.log('SessionEndedRequest function from main handlers is firing. ');
    
    var sessionAttributes = {};
        sessionAttributes = this.attributes;
    
        this.attributes['screen'] = "";
        this.attributes['goback'] = "";
    
    // ATTRIBUTES USED IN showSC FUNCTION
        this.attributes['scSSML'] = "";
        this.attributes['scTitle'] = "";
        this.attributes['scImageURL'] = "";
        this.attributes['scImageDesc'] = "";
        this.attributes['scCardName'] = "";
        this.attributes['scMeaning'] = "";
    
    // ATTRIBUTES USED IN 'show' SCREEN LOAD
    // FUNCTIONS TO FIRE INTRO MESSAGE ONLY
    // THE FIRST TIME USER VISITS THAT SCREEN,
    // BLANK OUT THE SPEECH WHEN USER GOES BACK
    // TO SCREEN
    
        this.attributes['homeSSML'] = "";
        this.attributes['maSSML'] = "";
        this.attributes['tcSSML'] = "";
        this.attributes['ccSSML'] = "";
        this.attributes['wandsSSML'] = "";
        this.attributes['cupsSSML'] = "";
        this.attributes['swordsSSML'] = "";
        this.attributes['pentaclesSSML'] = "";
    
    // ATTRIBUTES USED IN RANDOM CARD, THREE CARD
    // AND CELTIC CROSS READINGS
    
        this.attributes['rc'] = "";
        this.attributes['tcOne'] = "";
        this.attributes['tcTwo'] = "";
        this.attributes['tcThree'] = "";
        this.attributes['ccOne'] = "";
        this.attributes['ccTwo'] = "";
        this.attributes['ccThree'] = "";
        this.attributes['ccFour'] = "";
        this.attributes['ccFive'] = "";
        this.attributes['ccSix'] = "";
        this.attributes['ccSeven'] = "";
        this.attributes['ccEight'] = "";
        this.attributes['ccNine'] = "";
        this.attributes['ccTen'] = "";
    
        console.log("sessionAttributes members are cleared. ");
    
    },    

    
//=====================================
// UNHANDLED FUNCTION
//=====================================
    
    
    'Unhandled': function() {
        console.log("Unhandled function from main handlers is firing. ");
        this.emit(":ask", HELP_MESSAGE, REPROMPT_MESSAGE);
    }
    
//=====================================
// END UNHANDLED FUNCTION
//=====================================
   
        
};


//===========================================
//  EXPORTS HANDLER
//===========================================

exports.handler = function (event, session, context) {
    // Prints Request Event in CloudWatch Logs
    console.log("===EVENT=== \n" + JSON.stringify(event));
    
    const alexa = Alexa.handler(event, session, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


//==============================================================================
//=========================== Helper Functions  ================================
//==============================================================================

function supportsDisplay() {
  var hasDisplay =
    this.event.context &&
    this.event.context.System &&
    this.event.context.System.device &&
    this.event.context.System.device.supportedInterfaces &&
    this.event.context.System.device.supportedInterfaces.Display

  return hasDisplay;
}

function isSimulator() {
  var isSimulator = !this.event.context; //simulator doesn't send context
  return isSimulator;
}


//===========================================
//** END VISUAL TAROT ALEXA SKILL CODE
//===========================================
