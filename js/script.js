        // DOM Elements
        document.addEventListener('DOMContentLoaded', function() {
            // Reading List Tabs
            const readingTabs = document.querySelectorAll('.reading-tab');
            const readingContents = document.querySelectorAll('.reading-list-content');
            
            readingTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    readingTabs.forEach(t => {
                        t.classList.remove('border-book-green', 'text-book-green');
                        t.classList.add('text-gray-500', 'border-transparent');
                    });
                    
                    // Add active class to clicked tab
                    tab.classList.remove('text-gray-500', 'border-transparent');
                    tab.classList.add('border-book-green', 'text-book-green');
                    
                    // Hide all content
                    readingContents.forEach(content => {
                        content.classList.add('hidden');
                    });
                    
                    // Show corresponding content
                    const tabName = tab.getAttribute('data-tab');
                    document.getElementById(`${tabName}-list`).classList.remove('hidden');
                });
            });
            
            // Puzzle Tabs
            const puzzleTabs = document.querySelectorAll('.puzzle-tab');
            const puzzleContents = document.querySelectorAll('.puzzle-content');
            
            puzzleTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    puzzleTabs.forEach(t => {
                        t.classList.remove('border-book-red', 'text-book-red');
                        t.classList.add('text-gray-500', 'border-transparent');
                    });
                    
                    // Add active class to clicked tab
                    tab.classList.remove('text-gray-500', 'border-transparent');
                    tab.classList.add('border-book-red', 'text-book-red');
                    
                    // Hide all content
                    puzzleContents.forEach(content => {
                        content.classList.add('hidden');
                    });
                    
                    // Show corresponding content
                    const tabName = tab.getAttribute('data-tab');
                    document.getElementById(`${tabName}-puzzle`).classList.remove('hidden');
                });
            });
            
            // Codebreaker Puzzle
            const shiftInput = document.getElementById('shift-value');
            const applyShiftBtn = document.getElementById('apply-shift');
            const decodedInput = document.getElementById('decoded-message');
            const checkCipherBtn = document.getElementById('check-cipher');
            const cipherResult = document.getElementById('cipher-result');
            const cipherHintBtn = document.getElementById('cipher-hint');
            const cipherAttemptsEl = document.getElementById('cipher-attempts');
            
            let cipherAttempts = 0;
            const correctAnswer = "THE ONLY WAY TO LEARN IS TO LIVE";
            const encryptedMessage = "WKH RQOB ZDB WR OHDUQ LV WR OLYH";
            
            applyShiftBtn.addEventListener('click', () => {
                const shift = parseInt(shiftInput.value);
                const decrypted = caesarDecrypt(encryptedMessage, shift);
                decodedInput.value = decrypted;
            });
            
            checkCipherBtn.addEventListener('click', () => {
                cipherAttempts++;
                cipherAttemptsEl.textContent = cipherAttempts;
                
                const userAnswer = decodedInput.value.trim().toUpperCase();
                if (userAnswer === correctAnswer) {
                    cipherResult.innerHTML = `
                        <div class="bg-green-100 text-green-800 p-4 rounded-lg">
                            <p class="font-bold">Correct! You've solved the cipher.</p>
                            <p>The quote is: "${correctAnswer}"</p>
                        </div>
                    `;
                    cipherResult.classList.remove('hidden');
                } else {
                    cipherResult.innerHTML = `
                        <div class="bg-red-100 text-red-800 p-4 rounded-lg">
                            <p class="font-bold">Not quite right. Try again!</p>
                            <p>Hint: Make sure you've applied the correct shift value.</p>
                        </div>
                    `;
                    cipherResult.classList.remove('hidden');
                }
            });
            
            cipherHintBtn.addEventListener('click', () => {
                cipherResult.innerHTML = `
                    <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                        <p class="font-bold">Hint:</p>
                        <p>The correct shift value is 3. This is a Caesar cipher where each letter is shifted 3 positions in the alphabet.</p>
                    </div>
                `;
                cipherResult.classList.remove('hidden');
            });
            
            // Word Search Puzzle
            const wordSearchGrid = document.querySelector('.word-search-grid');
            const wordList = document.getElementById('word-list');
            const wordSearchHintBtn = document.getElementById('wordsearch-hint');
            const wordSearchResetBtn = document.getElementById('wordsearch-reset');
            const wordSearchResult = document.getElementById('wordsearch-result');
            
            // Create word search grid
            const grid = [
                ['N', 'L', 'I', 'B', 'R', 'A', 'R', 'Y', 'Q', 'Z'],
                ['O', 'X', 'M', 'E', 'D', 'F', 'O', 'R', 'D', 'B'],
                ['R', 'P', 'I', 'D', 'G', 'H', 'J', 'K', 'L', 'E'],
                ['A', 'M', 'D', 'F', 'T', 'Y', 'U', 'I', 'O', 'D'],
                ['M', 'I', 'N', 'O', 'R', 'A', 'S', 'D', 'F', 'F'],
                ['R', 'D', 'I', 'R', 'W', 'E', 'R', 'T', 'Y', 'O'],
                ['S', 'N', 'G', 'D', 'Q', 'W', 'E', 'R', 'T', 'R'],
                ['E', 'I', 'H', 'S', 'A', 'S', 'D', 'F', 'G', 'D'],
                ['L', 'G', 'T', 'A', 'Z', 'X', 'C', 'V', 'B', 'H'],
                ['M', 'H', 'U', 'G', 'O', 'Q', 'W', 'E', 'R', 'T']
            ];
            
            // Words to find and their positions
            const words = [
                { word: 'NORA', found: false },
                { word: 'LIBRARY', found: false },
                { word: 'MIDNIGHT', found: false },
                { word: 'HUGO', found: false },
                { word: 'BEDFORD', found: false },
                { word: 'MRS ELM', found: false }
            ];
            
            // Create grid cells
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].length; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'word-search-cell';
                    cell.textContent = grid[i][j];
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    
                    cell.addEventListener('click', () => {
                        cell.classList.toggle('selected');
                        checkSelectedWords();
                    });
                    
                    wordSearchGrid.appendChild(cell);
                }
            }
            
            function checkSelectedWords() {
                const selectedCells = document.querySelectorAll('.word-search-cell.selected');
                if (selectedCells.length < 3) return;
                
                // Get selected letters
                let selectedWord = '';
                selectedCells.forEach(cell => {
                    selectedWord += cell.textContent;
                });
                
                // Check if it matches any word
                words.forEach((wordObj, index) => {
                    if (selectedWord === wordObj.word.replace(' ', '') && !wordObj.found) {
                        wordObj.found = true;
                        
                        // Update word list
                        const listItems = wordList.querySelectorAll('li');
                        listItems[index].querySelector('span').classList.add('bg-book-green');
                        
                        // Keep cells highlighted
                        selectedCells.forEach(cell => {
                            cell.classList.add('bg-book-green', 'text-white');
                            cell.classList.remove('selected');
                        });
                        
                        // Check if all words found
                        if (words.every(w => w.found)) {
                            wordSearchResult.innerHTML = `
                                <div class="bg-green-100 text-green-800 p-4 rounded-lg">
                                    <p class="font-bold">Congratulations!</p>
                                    <p>You've found all the words in the word search!</p>
                                </div>
                            `;
                            wordSearchResult.classList.remove('hidden');
                        }
                    }
                });
            }
            
            wordSearchHintBtn.addEventListener('click', () => {
                // Find first unfound word
                const unfoundWord = words.find(w => !w.found);
                if (unfoundWord) {
                    wordSearchResult.innerHTML = `
                        <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                            <p class="font-bold">Hint:</p>
                            <p>Look for the word "${unfoundWord.word}" in the grid.</p>
                        </div>
                    `;
                    wordSearchResult.classList.remove('hidden');
                }
            });
            
            wordSearchResetBtn.addEventListener('click', () => {
                document.querySelectorAll('.word-search-cell.selected').forEach(cell => {
                    cell.classList.remove('selected');
                });
            });
            
            // Crossword Puzzle
            const crosswordGrid = document.querySelector('.crossword-grid');
            const crosswordHintBtn = document.getElementById('crossword-hint');
            const crosswordCheckBtn = document.getElementById('crossword-check');
            const crosswordResult = document.getElementById('crossword-result');
            
            // Crossword layout (0 = empty, 1 = fillable)
            const crosswordLayout = [
                [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
            ];
            
            // Crossword answers
            const crosswordAnswers = {
                'across': {
                    '1': 'SEED',
                    '6': 'LIBRARY',
                    '10': 'SWIMMER'
                },
                'down': {
                    '1': 'ELM',
                    '2': 'JOE',
                    '7': 'HAIG'
                }
            };
            
            // Cell numbers
            const cellNumbers = {
                '0,0': 1,
                '0,1': 2,
                '3,1': 3,
                '6,0': 6,
                '6,1': 7,
                '9,0': 10
            };
            
            // Create crossword grid
            for (let i = 0; i < crosswordLayout.length; i++) {
                for (let j = 0; j < crosswordLayout[i].length; j++) {
                    const cell = document.createElement('div');
                    cell.className = crosswordLayout[i][j] === 1 ? 'crossword-cell filled' : 'crossword-cell empty';
                    
                    if (crosswordLayout[i][j] === 1) {
                        // Add cell number if needed
                        if (cellNumbers[`${i},${j}`]) {
                            const numberSpan = document.createElement('span');
                            numberSpan.className = 'crossword-number';
                            numberSpan.textContent = cellNumbers[`${i},${j}`];
                            cell.appendChild(numberSpan);
                        }
                        
                        // Add input field
                        const input = document.createElement('input');
                        input.className = 'crossword-input';
                        input.maxLength = 1;
                        input.dataset.row = i;
                        input.dataset.col = j;
                        cell.appendChild(input);
                    }
                    
                    crosswordGrid.appendChild(cell);
                }
            }
            
            crosswordHintBtn.addEventListener('click', () => {
                // Find a random empty cell and fill it
                const emptyInputs = Array.from(document.querySelectorAll('.crossword-input')).filter(input => !input.value);
                if (emptyInputs.length > 0) {
                    const randomInput = emptyInputs[Math.floor(Math.random() * emptyInputs.length)];
                    const row = parseInt(randomInput.dataset.row);
                    const col = parseInt(randomInput.dataset.col);
                    
                    // Find which word this cell belongs to
                    let letter = '';
                    
                    // Check across words
                    for (const [clueNum, answer] of Object.entries(crosswordAnswers.across)) {
                        const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === parseInt(clueNum));
                        if (startCell) {
                            const [startCoords, _] = startCell;
                            const [startRow, startCol] = startCoords.split(',').map(Number);
                            
                            if (row === startRow && col >= startCol && col < startCol + answer.length) {
                                letter = answer[col - startCol];
                                break;
                            }
                        }
                    }
                    
                    // Check down words if letter not found
                    if (!letter) {
                        for (const [clueNum, answer] of Object.entries(crosswordAnswers.down)) {
                            const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === parseInt(clueNum));
                            if (startCell) {
                                const [startCoords, _] = startCell;
                                const [startRow, startCol] = startCoords.split(',').map(Number);
                                
                                if (col === startCol && row >= startRow && row < startRow + answer.length) {
                                    letter = answer[row - startRow];
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (letter) {
                        randomInput.value = letter;
                        randomInput.classList.add('bg-book-yellow');
                    }
                }
            });
            
            crosswordCheckBtn.addEventListener('click', () => {
                let allCorrect = true;
                const inputs = document.querySelectorAll('.crossword-input');
                
                inputs.forEach(input => {
                    const row = parseInt(input.dataset.row);
                    const col = parseInt(input.dataset.col);
                    let correctLetter = '';
                    
                    // Check across words
                    for (const [clueNum, answer] of Object.entries(crosswordAnswers.across)) {
                        const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === parseInt(clueNum));
                        if (startCell) {
                            const [startCoords, _] = startCell;
                            const [startRow, startCol] = startCoords.split(',').map(Number);
                            
                            if (row === startRow && col >= startCol && col < startCol + answer.length) {
                                correctLetter = answer[col - startCol];
                                break;
                            }
                        }
                    }
                    
                    // Check down words if letter not found
                    if (!correctLetter) {
                        for (const [clueNum, answer] of Object.entries(crosswordAnswers.down)) {
                            const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === parseInt(clueNum));
                            if (startCell) {
                                const [startCoords, _] = startCell;
                                const [startRow, startCol] = startCoords.split(',').map(Number);
                                
                                if (col === startCol && row >= startRow && row < startRow + answer.length) {
                                    correctLetter = answer[row - startRow];
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (input.value.toUpperCase() === correctLetter) {
                        input.classList.add('bg-green-100');
                        input.classList.remove('bg-red-100');
                    } else {
                        input.classList.add('bg-red-100');
                        input.classList.remove('bg-green-100');
                        allCorrect = false;
                    }
                });
                
                if (allCorrect) {
                    crosswordResult.innerHTML = `
                        <div class="bg-green-100 text-green-800 p-4 rounded-lg">
                            <p class="font-bold">Congratulations!</p>
                            <p>You've solved the crossword puzzle correctly!</p>
                        </div>
                    `;
                    crosswordResult.classList.remove('hidden');
                } else {
                    crosswordResult.innerHTML = `
                        <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                            <p class="font-bold">Almost there!</p>
                            <p>Some answers are incorrect. Red cells need to be fixed.</p>
                        </div>
                    `;
                    crosswordResult.classList.remove('hidden');
                }
            });
            
            // Helper function for Caesar cipher
            function caesarDecrypt(text, shift) {
                return text.split('').map(char => {
                    if (char === ' ') return ' ';
                    const code = char.charCodeAt(0);
                    if (code < 65 || code > 90) return char; // Not A-Z
                    
                    let decrypted = code - shift;
                    if (decrypted < 65) decrypted += 26;
                    
                    return String.fromCharCode(decrypted);
                }).join('');
            }
        });
 