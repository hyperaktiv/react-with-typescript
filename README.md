I. Installation
   1. Basic step
   npx create-react-app my-app --template typescript
   # or
   yarn create react-app my-app --template typescript

   2. To add TypeScript to a Create React App project, first install it:
   npm install --save typescript @types/node @types/react @types/react-dom @types/jest
   # or
   yarn add typescript @types/node @types/react @types/react-dom @types/jest

   3. Install styled-components for tsx
   npm i styled-components @types/styled-components

   4. Import a background images for app to src/images

   5. Could be insert a new font for your app with google font

   6. Fetching question and answers data with opentdb.com
      go to website and get the api.

II. The logic processing
   1. Hiểu cấu trúc của app
      - Components: QuestionCard
      - Gọi component ra App.tsx và xử lý các hàm logic
      - tạo các file cần thiết:
         + QuestionCard.tsx   : components hiển thị thẻ câu hỏi
         + API.tsx  : file lấy data ở đây là các questions và answers từ API opentdb.com
         + utils.tsx : 

   2. Bắt đầu code
* Gọi các hàm cần thiết trong App.js
   + gọi đến api của trivia lấy data:
      const startTrivia = async () => {

      }
   + check đáp án khi click chuột vào card đáp án:
      const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {

      }
   + chuẩn bị cho question tiếp theo:
      const nextQuestion = () => {

      }
   + ra form và background cho màn hình làm việc:
      <div className="App">
         <h1>ReactJS - Typescript QUIZ</h1>
         <button className="start" onClick={startTrivia}>Start</button>
         <p className="score">Score: </p>
         <p>Loading Questions ...</p>
         <QuestionCart/>
         <button className="next" onClick={nextQuestion}>Next Question</button>
      </div>

* Code cho components/QuestionCard.tsx
   - định danh các parameter/tham số hoặc giá trị cho biến Props:
      type Props = {
         question: string,
         answers: string[],
         callback: any,
         userAnswer: any,
         questionNz: number,
         totalQuestions: number,
      }
   - viết function QuestionCard và export default ra với kiểu hàm là <Props> và tham số truyền vào là một object với thuộc tính của object là các thuộc tính của Props:
   const QuestionCard: React.FC<Props> = ({
      question, answers, callback, userAnswer, questionNr, totalQuestions
   }) => { 
      return (
         <div>
            <p className="number">
               Question: {questionNr} / {totalQuestions}
            </p>
            <p dangerouslySetInnerHTML={ {__html: question} }></p>
            <div>
               { answers.map(answer => (
                  <div key={answer}>
                     <button disabled={userAnswer} value={answer} onClick={callback}>
                        <span dangerouslySetInnerHTML={ {__html: answer} }></span>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      );
   }
   

* trở lại với App.tsx
   gọi và truyền các tham số cần thiết cho component QuestionCard
   // định số câu hỏi cho một part game:
   const TOTAL_QUESTIONS = 10;

   // xác định các tham số và các hàm tương ứng để tương tác với tham số cần thiết của game
   function App() {

      const [loading, setLoading] = useState(false);
      const [questions, setQuestions] = useState([]);
      const [number, setNumber] = useState(0);
      const [userAnswers, setUserAnswers] = useState([]);
      const [score, setScore] = useState(0);
      const [gameOver, setGameOver] = useState(true);

      ....
   }

   // truyền các tham số tương ứng vào component QuestionCard:
   <QuestionCart 
      questionNr={number+1}      // câu hỏi tiếp theo
      totalQuestions={TOTAL_QUESTIONS}
      question={questions[number].question}  // nội dung câu hỏi hiện tại
      answers={questions[number].answers} // đáp án trắc nghiệm của câu hỏi
      userAnswer={userAnswers ? userAnswers[number] : undefined}  // câu trả lời hiện tại của từ người chơi
      callback={checkAnswer}  // hàm kiểm tra độ chính xác của cô hỏi để ra điểm
   />
* sang file API.ts:
   export type Question = {
      category: string;
      correct_answer: string;
      difficulty: string;
      incorrect_answers: string[];
      question: string;
      type: string;
   }
   export type QuestionState = Question & { answers: string[] };
   export enum Difficulty {
      EASY = "easy",
      MEDIUM = "medium",
      HARD = "hard",
   }
   export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty) => {
      const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
      const data = await(await fetch(endpoint)).json();
      console.log(data);
   }

   - export Question type ứng với các thuộc tính trong data fetch từ API trivia
   - export QuestionState là các câu trả lời
   - export ra Difficulty là các hình thức câu hỏi theo độ khó
   - export function fetchQuizQuestions lấy data từ website: opentdb.com bằng biến endpont sau đó check data:

      console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY)); // ở đâu đó bên App.ts

   data get được:
     ["result[0] category: "Entertainment: Video Games"
      correct_answer: "Pokemon"
      difficulty: "easy"
      incorrect_answers: Array(3)
         [0: "Dragon Ball"
         1: "Sonic The Hedgehog"
         2: "Yugioh"
         length: 3]
      question: "Which franchise does the creature &quot;Slowpoke&quot; originate from?"
      type: "multiple"  ...  "]

* fil utils.tsx: ghép lại các đáp án thành một array để phục vụ display các câu trả lời
   export const shuffleArray = (array: any[]) => {
      // small function to randomize the answers to the question
      
      return [...array].sort( () => Math.random() - 0.5 );
   }

* set lại giá trị biểu thị của question khi display out:
const [questions, setQuestions] = useState<QuestionState[]>([]);

* viết các hành động == phương thức startTrivia khi click vào nút Start:
   const startTrivia = async () => {
      setLoading(true);
      setGameOver(false);
      const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY);
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);
   }
   - lặp lại một vòng trước khi loading lấy data câu hỏi đến khi gọi API lấy data => set lại vào các biến lưu trữ "question" => loading true.

* tạo thêm type AnswerObject từ người dùng khi đưa ra câu trả lời:
   type AnswerObject = {
      question: string;
      answer: string;
      question_status: boolean;
      correctAnswer: string;
   }
   const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);

* viết hàm chechAnswer:
   const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      // câu trả lời của người chơi
      const answer = e.currentTarget.value;
      // kiểm tra tính đúng của câu trả lời từ người chơi
      const correct = questions[number].correct_answer === answer;
      // cộng điểm nếu câu trả lời đúng
      if(correct) setScore(prev => prev + 1);
      // lưu trả lời của người chơi vào một Object
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      // gọi hàm cập nhật state useranswer
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  }

* viết hàm nextQuestion:
   const nextQuestion = () => {
      // chuyển đến câu hỏi tiếp theo nếu chưa đến câu cuối cùng
      const nextQuestion = number + 1;

      if(nextQuestion === TOTAL_QUESTIONS){
         setGameOver(true);
      } else {
         setNumber(nextQuestion);
      }
  }

* chỉnh lại một số kiểu dữ liệu cho phù hợp: 
- export type AnswerObject từ App.ts
   export type AnswerObject = { ... }
- import type trên vào QuestionCard.tsx và sửa lại type của một số biến:
   callback: (e: React.MouseEvent<HTMLButtonElement>) => void,
   userAnswer: AnswerObject | undefined,

   + hàm callback trả về đúng sự kiện tương ứng
   + biến userAnswer ứng với Object được tạo ra khi người chơi chọn câu trả lời
   + cập nhật lại button:
      <button disabled={userAnswer ? true : false} value={answer} onClick={callback}>...</>

III. Styling cho đẹp

   * style cho QuestionCard.styles.ts
      import styled from 'styled-components';

      export const Wrapper = styled.div`
         max-width: 1100px;
         background: #ebfeff;
         border-radius: 10px;
         border: 2px solid #0085a3;
         padding: 20px;
         box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
         text-align: center;
         p {
            font-size: 1rem;
         }
      `;

      type ButtonWrapperProps = {
         correct: boolean;
         userClicked: boolean;
      };

      export const ButtonWrapper = styled.div<ButtonWrapperProps>`
         transition: all 0.3s ease;
         :hover {
            opacity: 0.8;
         }
         button {
            cursor: pointer;
            user-select: none;
            font-size: 0.8rem;
            width: 100%;
            height: 40px;
            margin: 5px 0;
            background: ${({ correct, userClicked }) =>
               correct
               ? 'linear-gradient(90deg, #56FFA4, #59BC86)'
               : !correct && userClicked
               ? 'linear-gradient(90deg, #FF5656, #C16868)'
               : 'linear-gradient(90deg, #56ccff, #6eafb4)'};
            border: 3px solid #ffffff;
            box-shadow: 1px 2px 0px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            color: #fff;
            text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25);
         }
      `;

   - sửa lại cho thẻ tag trong QuestionCard.tsx

      ...
      return (
         <Wrapper>
            <p className='number'>
               Question: {questionNr} / {totalQuestions}
            </p>
            <p dangerouslySetInnerHTML={{ __html: question }} />
            <div>
               {answers.map((answer) => (
               <ButtonWrapper
                  key={answer}
                  correct={userAnswer?.correctAnswer === answer}
                  userClicked={userAnswer?.answer === answer}
               >
                  <button disabled={userAnswer ? true : false} value={answer} onClick={callback}>
                     <span dangerouslySetInnerHTML={{ __html: answer }} />
                  </button>
               </ButtonWrapper>
               ))}
            </div>
         </Wrapper>
      );

   * style cho App.styles.ts
      import styled, { createGlobalStyle } from 'styled-components';
      import BGImage from './images/nattu-adnan-unsplash.jpg';

      export const GlobalStyle = createGlobalStyle`
      html {
         height: 100%;
      }
      body {
         background-image: url(${BGImage});
         background-size: cover;
         margin: 0;
         padding: 0 20px;
         display: flex;
         justify-content: center;
      }
      * {
         font-family: 'Catamaran', sans-serif;
         box-sizing: border-box;
      }
      `;

      export const Wrapper = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      > p {
         color: #fff;
      }
      .score {
         color: #fff;
         font-size: 2rem;
         margin: 0;
      }
      h1 {
         font-family: Fascinate Inline;
         background-image: linear-gradient(180deg, #fff, #87f1ff);
         font-weight: 400;
         background-size: 100%;
         background-clip: text;
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         -moz-background-clip: text;
         -moz-text-fill-color: transparent;
         filter: drop-shadow(2px 2px #0085a3);
         font-size: 70px;
         text-align: center;
         margin: 20px;
      }
      .start, .next {
         cursor: pointer;
         background: linear-gradient(180deg, #ffffff, #ffcc91);
         border: 2px solid #d38558;
         box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
         border-radius: 10px;
         height: 40px;
         margin: 20px 0;
         padding: 0 40px;
      }
      .start {
         max-width: 200px;
      }
      `;

   - đồng thời sửa lại một số thẻ div trong App.tsx
      return (
         <>
            <GlobalStyle />
            <Wrapper>
            <h1>ReactJS - Typescript QUIZ</h1>
            {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
               <button className="start" onClick={startTrivia}>Start</button>
            ) : null}
            {!gameOver ? (<p className="score">Score: {score}</p>) : null}
            {loading && (<p>Loading Questions ...</p>)}

            {!loading && !gameOver && (
               <QuestionCart
                  questionNr={number + 1}
                  totalQuestions={TOTAL_QUESTIONS}
                  question={questions[number].question}
                  answers={questions[number].answers}
                  userAnswer={userAnswers ? userAnswers[number] : undefined}
                  callback={checkAnswer}
               />
            )}

            {!loading &&
               !gameOver &&
               userAnswers.length === number + 1 &&
               number !== TOTAL_QUESTIONS - 1 ? (
                  <button className="next" onClick={nextQuestion}>Next Question</button>
               ) : null
            }
            </Wrapper>
         </>
      );