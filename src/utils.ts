

export const shuffleArray = (array: any[]) => {
   // small function to randomize the answers to the question
   
   return [...array].sort( () => Math.random() - 0.5 );
}