const url = "https://hcp-server.ieltsbro.com/hcp/qsBank/oralTopic/oralAnswerPage";
const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "platform": "ios",
    "source": "0"
};

var questions = [];

async function scrapeQuestions(dataPart, oralPart) {
    questions = [];
    const data = {
        curPage: 0,
        oralTopCatLog: "4",
        part: dataPart
    };
    while (true) {
        console.log(`Progressing page number: ${data.curPage}`);
        try {
            const response = await axios.post(url, data, { headers });
            const responseJson = response.data;

            if (responseJson.content.list && responseJson.content.list.length > 0) {
                for (const topic of responseJson.content.list) {
                    var topic_questions = [];
                    for (const question of topic.questionList) {
                        if (oralPart == 1){
                            topic_questions.push(question.oralQuestion)
                        }
                        else {
                            topic_questions.push("Part " + question.oralPart + ": " + question.oralQuestion)
                        }
                        
                    }
                    questions.push(topic_questions);
                }
                data.curPage += 1;
            } else {
                console.log("Done");
                break;
            }
        } catch (error) {
            console.error(`Error on page ${data.curPage}:`, error.message);
            break;
        }
    }
}

function newQuestion() {
    var randomNumber = Math.floor(Math.random() * (questions.length));
    var selectedQuestionList = questions[randomNumber];
    document.getElementById('questionDisplay').innerHTML = selectedQuestionList.join('<br>');
}