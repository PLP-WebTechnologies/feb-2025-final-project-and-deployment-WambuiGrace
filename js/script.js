document.addEventListener("DOMContentLoaded", () => {
  // ========== READING LIST FUNCTIONALITY ==========
  // Tabs
  const readingTabs = document.querySelectorAll(".reading-tab")
  const readingContents = document.querySelectorAll(".reading-list-content")

  readingTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      readingTabs.forEach((t) => {
        t.classList.remove("border-book-green", "text-book-green")
        t.classList.add("text-gray-500", "border-transparent")
      })

      // Add active class to clicked tab
      tab.classList.remove("text-gray-500", "border-transparent")
      tab.classList.add("border-book-green", "text-book-green")

      // Hide all content
      readingContents.forEach((content) => {
        content.classList.add("hidden")
      })

      // Show corresponding content
      const tabName = tab.getAttribute("data-tab")
      const contentId = tabName === "reading" ? "reading-list-tab" : `${tabName}-list`
      document.getElementById(contentId).classList.remove("hidden")
    })
  })

  // Render and manage reading list
  function renderToReadList() {
    const container = document.getElementById("to-read-dynamic")
    const countText = document.getElementById("to-read-count")
    if (!container) return
    const readingList = JSON.parse(localStorage.getItem("readingList")) || []
    container.innerHTML = ""
    readingList.forEach((book, idx) => {
      container.innerHTML += `
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="flex p-4">
          <img src="${book.cover}" alt="Book Cover" class="w-20 h-30 object-cover rounded">
          <div class="ml-4 flex-1">
            <h3 class="font-bold text-lg mb-1">${book.title}</h3>
            <p class="text-gray-600 text-sm mb-2">by ${book.author}</p>
            <div class="flex justify-between items-center mt-3">
              <button class="bg-book-green hover:bg-book-dark text-white font-bold py-1 px-3 rounded-full text-xs transition-colors start-reading-btn" data-idx="${idx}">
                Start Reading
              </button>
              <button class="text-gray-400 hover:text-book-red remove-book-btn" data-idx="${idx}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    })
    if (countText) {
      countText.textContent = `You have ${readingList.length} book${readingList.length !== 1 ? "s" : ""} in your "To Read" list`
    }

    // Add event listeners for Start Reading buttons
    container.querySelectorAll(".start-reading-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number.parseInt(btn.getAttribute("data-idx"))
        const readingList = JSON.parse(localStorage.getItem("readingList")) || []
        const currentlyReading = JSON.parse(localStorage.getItem("currentlyReading")) || []
        const book = readingList[idx]
        // Remove from to-read
        readingList.splice(idx, 1)
        localStorage.setItem("readingList", JSON.stringify(readingList))
        // Add to currently reading if not already there
        if (!currentlyReading.some((b) => b.title === book.title && b.author === book.author)) {
          currentlyReading.push({ ...book, progress: 0 })
          localStorage.setItem("currentlyReading", JSON.stringify(currentlyReading))
        }
        renderToReadList()
        renderCurrentlyReadingList()

        // Switch to Currently Reading tab
        document.querySelectorAll(".reading-tab").forEach((tab) => {
          if (tab.getAttribute("data-tab") === "reading") {
            tab.click()
          }
        })
      })
    })

    // Add event listeners for Remove buttons
    container.querySelectorAll(".remove-book-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number.parseInt(btn.getAttribute("data-idx"))
        const readingList = JSON.parse(localStorage.getItem("readingList")) || []
        readingList.splice(idx, 1)
        localStorage.setItem("readingList", JSON.stringify(readingList))
        renderToReadList()
      })
    })
  }

  function renderCurrentlyReadingList() {
    const container = document.getElementById("reading-list-content")
    const countText = document.getElementById("currently-reading-count")
    if (!container) return
    const currentlyReading = JSON.parse(localStorage.getItem("currentlyReading")) || []
    container.innerHTML = ""
    currentlyReading.forEach((book, idx) => {
      container.innerHTML += `
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="flex p-4">
          <img src="${book.cover || "/placeholder.svg?height=120&width=80"}" alt="Book Cover" class="w-20 h-30 object-cover rounded">
          <div class="ml-4 flex-1">
            <h3 class="font-bold text-lg mb-1">${book.title}</h3>
            <p class="text-gray-600 text-sm mb-2">by ${book.author}</p>
            <div class="mb-2">
              <div class="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>${book.progress || 0}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-book-green h-2.5 rounded-full" style="width: ${book.progress || 0}%"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <button class="bg-book-yellow hover:bg-book-orange text-book-dark font-bold py-1 px-3 rounded-full text-xs transition-colors update-progress-btn" data-idx="${idx}">
                Update Progress
              </button>
              <button class="bg-book-green hover:bg-book-dark text-white font-bold py-1 px-3 rounded-full text-xs transition-colors mark-complete-btn" data-idx="${idx}">
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    })

    if (countText) {
      countText.textContent = `You are currently reading ${currentlyReading.length} book${currentlyReading.length !== 1 ? "s" : ""}`
    }

    // Add event listeners for Mark Complete buttons
    container.querySelectorAll(".mark-complete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number.parseInt(btn.getAttribute("data-idx"))
        const currentlyReading = JSON.parse(localStorage.getItem("currentlyReading")) || []
        const completedList = JSON.parse(localStorage.getItem("completedList")) || []
        const book = currentlyReading[idx]
        // Remove from currently reading
        currentlyReading.splice(idx, 1)
        localStorage.setItem("currentlyReading", JSON.stringify(currentlyReading))
        // Add to completed with completion date
        if (!completedList.some((b) => b.title === book.title && b.author === book.author)) {
          const today = new Date()
          const completedBook = {
            ...book,
            completedDate: today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          }
          completedList.push(completedBook)
          localStorage.setItem("completedList", JSON.stringify(completedList))
        }
        renderCurrentlyReadingList()
        renderCompletedList()

        // Switch to Completed tab
        document.querySelectorAll(".reading-tab").forEach((tab) => {
          if (tab.getAttribute("data-tab") === "completed") {
            tab.click()
          }
        })
      })
    })

    // Add event listeners for Update Progress buttons
    container.querySelectorAll(".update-progress-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number.parseInt(btn.getAttribute("data-idx"))
        const currentlyReading = JSON.parse(localStorage.getItem("currentlyReading")) || []
        const book = currentlyReading[idx]

        const newProgress = prompt(`Update reading progress for "${book.title}" (0-100%):`, book.progress || 0)
        if (newProgress !== null) {
          const progress = Math.min(100, Math.max(0, Number.parseInt(newProgress) || 0))
          currentlyReading[idx].progress = progress
          localStorage.setItem("currentlyReading", JSON.stringify(currentlyReading))
          renderCurrentlyReadingList()
        }
      })
    })
  }

  function renderCompletedList() {
    const container = document.getElementById("completed-list")
    if (!container) return
    const completedList = JSON.parse(localStorage.getItem("completedList")) || []

    const completedGrid = container.querySelector(".grid")
    if (completedGrid) {
      completedGrid.innerHTML = ""

      completedList.forEach((book, idx) => {
        completedGrid.innerHTML += `
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="flex p-4">
            <img src="${book.cover || "/placeholder.svg?height=120&width=80"}" alt="Book Cover" class="w-20 h-30 object-cover rounded">
            <div class="ml-4 flex-1">
              <h3 class="font-bold text-lg mb-1">${book.title}</h3>
              <p class="text-gray-600 text-sm mb-2">by ${book.author}</p>
              <div class="flex mb-2">
                <div class="text-book-yellow">★★★★★</div>
              </div>
              <p class="text-gray-500 text-xs mb-3">Completed on ${book.completedDate}</p>
              <div class="flex justify-between items-center">
                <button class="bg-book-orange hover:bg-book-red text-white font-bold py-1 px-3 rounded-full text-xs transition-colors">
                  Write Review
                </button>
                <button class="bg-book-green hover:bg-book-dark text-white font-bold py-1 px-3 rounded-full text-xs transition-colors read-again-btn" data-idx="${idx}">
                  Read Again
                </button>
              </div>
            </div>
          </div>
        </div>
      `
      })

      // Update count text
      const countText = container.querySelector("p.text-gray-500")
      if (countText) {
        countText.textContent = `You have completed ${completedList.length} book${completedList.length !== 1 ? "s" : ""}`
      }

      // Add event listeners for Read Again buttons
      completedGrid.querySelectorAll(".read-again-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number.parseInt(btn.getAttribute("data-idx"))
          const completedList = JSON.parse(localStorage.getItem("completedList")) || []
          const currentlyReading = JSON.parse(localStorage.getItem("currentlyReading")) || []
          const book = completedList[idx]

          // Add to currently reading if not already there
          if (!currentlyReading.some((b) => b.title === book.title && b.author === book.author)) {
            currentlyReading.push({
              title: book.title,
              author: book.author,
              cover: book.cover,
              progress: 0,
            })
            localStorage.setItem("currentlyReading", JSON.stringify(currentlyReading))
          }

          renderCurrentlyReadingList()

          // Switch to Currently Reading tab
          document.querySelectorAll(".reading-tab").forEach((tab) => {
            if (tab.getAttribute("data-tab") === "reading") {
              tab.click()
            }
          })
        })
      })
    }
  }

  // Add event listeners for remove buttons
  document.querySelectorAll(".remove-book").forEach((btn) => {
    btn.addEventListener("click", function () {
      const title = this.getAttribute("data-title")
      const author = this.getAttribute("data-author")
      removeFromReadingList(title, author)
    })
  })

  function removeFromReadingList(title, author) {
    let readingList = JSON.parse(localStorage.getItem("readingList")) || []
    readingList = readingList.filter((book) => !(book.title === title && book.author === author))
    localStorage.setItem("readingList", JSON.stringify(readingList))
    renderToReadList()
  }

  // Add to reading list functionality
  document.querySelectorAll(".add-to-list-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const book = {
        title: btn.getAttribute("data-title"),
        author: btn.getAttribute("data-author"),
        cover: btn.getAttribute("data-cover"),
      }
      const readingList = JSON.parse(localStorage.getItem("readingList")) || []

      if (!readingList.some((b) => b.title === book.title && b.author === book.author)) {
        readingList.push(book)
        localStorage.setItem("readingList", JSON.stringify(readingList))
        alert(`"${book.title}" added to your reading list!`)
        renderToReadList()
      } else {
        alert("This book is already in your reading list.")
      }
    })
  })

  // Initial render
  renderToReadList()
  renderCurrentlyReadingList()
  renderCompletedList()

  // ========== PUZZLE FUNCTIONALITY ==========
  // (Keep all your existing puzzle code exactly as is)
  const puzzleTabs = document.querySelectorAll(".puzzle-tab")
  const puzzleContents = document.querySelectorAll(".puzzle-content")

  puzzleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      puzzleTabs.forEach((t) => {
        t.classList.remove("border-book-red", "text-book-red")
        t.classList.add("text-gray-500", "border-transparent")
      })

      // Add active class to clicked tab
      tab.classList.remove("text-gray-500", "border-transparent")
      tab.classList.add("border-book-red", "text-book-red")

      // Hide all content
      puzzleContents.forEach((content) => {
        content.classList.add("hidden")
      })

      // Show corresponding content
      const tabName = tab.getAttribute("data-tab")
      document.getElementById(`${tabName}-puzzle`).classList.remove("hidden")
    })
  })

  // --- Add to Reading List functionality ---
  document.querySelectorAll(".add-to-list-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const book = {
        title: btn.getAttribute("data-title"),
        author: btn.getAttribute("data-author"),
        cover: btn.getAttribute("data-cover"),
      }
      const readingList = JSON.parse(localStorage.getItem("readingList")) || []
      // Avoid duplicates
      if (!readingList.some((b) => b.title === book.title && b.author === book.author)) {
        readingList.push(book)
        localStorage.setItem("readingList", JSON.stringify(readingList))
        alert(`"${book.title}" added to your reading list!`)
      } else {
        alert("This book is already in your reading list.")
      }
    })
  })

  // Codebreaker Puzzle
  const shiftInput = document.getElementById("shift-value")
  const applyShiftBtn = document.getElementById("apply-shift")
  const decodedInput = document.getElementById("decoded-message")
  const checkCipherBtn = document.getElementById("check-cipher")
  const cipherResult = document.getElementById("cipher-result")
  const cipherHintBtn = document.getElementById("cipher-hint")
  const cipherAttemptsEl = document.getElementById("cipher-attempts")

  let cipherAttempts = 0
  const correctAnswer = "THE ONLY WAY TO LEARN IS TO LIVE"
  const encryptedMessage = "WKH RQOB ZDB WR OHDUQ LV WR OLYH"

  applyShiftBtn.addEventListener("click", () => {
    const shift = Number.parseInt(shiftInput.value)
    const decrypted = caesarDecrypt(encryptedMessage, shift)
    decodedInput.value = decrypted
  })

  checkCipherBtn.addEventListener("click", () => {
    cipherAttempts++
    cipherAttemptsEl.textContent = cipherAttempts

    const userAnswer = decodedInput.value.trim().toUpperCase()
    if (userAnswer === correctAnswer) {
      cipherResult.innerHTML = `
                <div class="bg-green-100 text-green-800 p-4 rounded-lg">
                    <p class="font-bold">Correct! You've solved the cipher.</p>
                    <p>The quote is: "${correctAnswer}"</p>
                </div>
            `
      cipherResult.classList.remove("hidden")
    } else {
      cipherResult.innerHTML = `
                <div class="bg-red-100 text-red-800 p-4 rounded-lg">
                    <p class="font-bold">Not quite right. Try again!</p>
                    <p>Hint: Make sure you've applied the correct shift value.</p>
                </div>
            `
      cipherResult.classList.remove("hidden")
    }
  })

  cipherHintBtn.addEventListener("click", () => {
    cipherResult.innerHTML = `
            <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                <p class="font-bold">Hint:</p>
                <p>The correct shift value is 3. This is a Caesar cipher where each letter is shifted 3 positions in the alphabet.</p>
            </div>
        `
    cipherResult.classList.remove("hidden")
  })

  // Word Search Puzzle
  const wordSearchGrid = document.querySelector(".word-search-grid")
  const wordList = document.getElementById("word-list")
  const wordSearchHintBtn = document.getElementById("wordsearch-hint")
  const wordSearchResetBtn = document.getElementById("wordsearch-reset")
  const wordSearchResult = document.getElementById("wordsearch-result")

  // Create word search grid
  const grid = [
    ["N", "L", "I", "B", "R", "A", "R", "Y", "Q", "Z"],
    ["O", "X", "M", "E", "D", "F", "O", "R", "D", "B"],
    ["R", "P", "I", "D", "G", "H", "J", "K", "L", "E"],
    ["A", "M", "D", "F", "T", "Y", "U", "I", "O", "D"],
    ["M", "I", "N", "O", "R", "A", "S", "D", "F", "F"],
    ["R", "D", "I", "R", "W", "E", "R", "T", "Y", "O"],
    ["S", "N", "G", "D", "Q", "W", "E", "R", "T", "R"],
    ["E", "I", "H", "S", "A", "S", "D", "F", "G", "D"],
    ["L", "G", "T", "A", "Z", "X", "C", "V", "B", "H"],
    ["M", "H", "U", "G", "O", "Q", "W", "E", "R", "T"],
  ]

  // Words to find and their positions
  const words = [
    { word: "NORA", found: false },
    { word: "LIBRARY", found: false },
    { word: "MIDNIGHT", found: false },
    { word: "HUGO", found: false },
    { word: "BEDFORD", found: false },
    { word: "MRS ELM", found: false },
  ]

  // Create grid cells
  if (wordSearchGrid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = document.createElement("div")
        cell.className = "word-search-cell"
        cell.textContent = grid[i][j]
        cell.dataset.row = i
        cell.dataset.col = j

        cell.addEventListener("click", () => {
          cell.classList.toggle("selected")
          checkSelectedWords()
        })

        wordSearchGrid.appendChild(cell)
      }
    }
  }

  function checkSelectedWords() {
    const selectedCells = document.querySelectorAll(".word-search-cell.selected")
    if (selectedCells.length < 3) return

    // Get selected letters
    let selectedWord = ""
    selectedCells.forEach((cell) => {
      selectedWord += cell.textContent
    })

    // Check if it matches any word
    words.forEach((wordObj, index) => {
      if (selectedWord === wordObj.word.replace(" ", "") && !wordObj.found) {
        wordObj.found = true

        // Update word list
        const listItems = wordList.querySelectorAll("li")
        listItems[index].querySelector("span").classList.add("bg-book-green")

        // Keep cells highlighted
        selectedCells.forEach((cell) => {
          cell.classList.add("bg-book-green", "text-white")
          cell.classList.remove("selected")
        })

        // Check if all words found
        if (words.every((w) => w.found)) {
          wordSearchResult.innerHTML = `
                        <div class="bg-green-100 text-green-800 p-4 rounded-lg">
                            <p class="font-bold">Congratulations!</p>
                            <p>You've found all the words in the word search!</p>
                        </div>
                    `
          wordSearchResult.classList.remove("hidden")
        }
      }
    })
  }

  if (wordSearchHintBtn) {
    wordSearchHintBtn.addEventListener("click", () => {
      // Find first unfound word
      const unfoundWord = words.find((w) => !w.found)
      if (unfoundWord) {
        wordSearchResult.innerHTML = `
                    <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                        <p class="font-bold">Hint:</p>
                        <p>Look for the word "${unfoundWord.word}" in the grid.</p>
                    </div>
                `
        wordSearchResult.classList.remove("hidden")
      }
    })
  }

  if (wordSearchResetBtn) {
    wordSearchResetBtn.addEventListener("click", () => {
      document.querySelectorAll(".word-search-cell.selected").forEach((cell) => {
        cell.classList.remove("selected")
      })
    })
  }

  // Crossword Puzzle
  const crosswordGrid = document.querySelector(".crossword-grid")
  const crosswordHintBtn = document.getElementById("crossword-hint")
  const crosswordCheckBtn = document.getElementById("crossword-check")
  const crosswordResult = document.getElementById("crossword-result")

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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ]

  // Crossword answers
  const crosswordAnswers = {
    across: {
      1: "SEED",
      6: "LIBRARY",
      10: "SWIMMER",
    },
    down: {
      1: "ELM",
      2: "JOE",
      7: "HAIG",
    },
  }

  // Cell numbers
  const cellNumbers = {
    "0,0": 1,
    "0,1": 2,
    "3,1": 3,
    "6,0": 6,
    "6,1": 7,
    "9,0": 10,
  }

  // Create crossword grid
  if (crosswordGrid) {
    for (let i = 0; i < crosswordLayout.length; i++) {
      for (let j = 0; j < crosswordLayout[i].length; j++) {
        const cell = document.createElement("div")
        cell.className = crosswordLayout[i][j] === 1 ? "crossword-cell filled" : "crossword-cell empty"

        if (crosswordLayout[i][j] === 1) {
          // Add cell number if needed
          if (cellNumbers[`${i},${j}`]) {
            const numberSpan = document.createElement("span")
            numberSpan.className = "crossword-number"
            numberSpan.textContent = cellNumbers[`${i},${j}`]
            cell.appendChild(numberSpan)
          }

          // Add input field
          const input = document.createElement("input")
          input.className = "crossword-input"
          input.maxLength = 1
          input.dataset.row = i
          input.dataset.col = j
          cell.appendChild(input)
        }

        crosswordGrid.appendChild(cell)
      }
    }
  }

  if (crosswordHintBtn) {
    crosswordHintBtn.addEventListener("click", () => {
      // Find a random empty cell and fill it
      const emptyInputs = Array.from(document.querySelectorAll(".crossword-input")).filter((input) => !input.value)
      if (emptyInputs.length > 0) {
        const randomInput = emptyInputs[Math.floor(Math.random() * emptyInputs.length)]
        const row = Number.parseInt(randomInput.dataset.row)
        const col = Number.parseInt(randomInput.dataset.col)

        // Find which word this cell belongs to
        let letter = ""

        // Check across words
        for (const [clueNum, answer] of Object.entries(crosswordAnswers.across)) {
          const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === Number.parseInt(clueNum))
          if (startCell) {
            const [startCoords, _] = startCell
            const [startRow, startCol] = startCoords.split(",").map(Number)

            if (row === startRow && col >= startCol && col < startCol + answer.length) {
              letter = answer[col - startCol]
              break
            }
          }
        }

        // Check down words if letter not found
        if (!letter) {
          for (const [clueNum, answer] of Object.entries(crosswordAnswers.down)) {
            const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === Number.parseInt(clueNum))
            if (startCell) {
              const [startCoords, _] = startCell
              const [startRow, startCol] = startCoords.split(",").map(Number)

              if (col === startCol && row >= startRow && row < startRow + answer.length) {
                letter = answer[row - startRow]
                break
              }
            }
          }
        }

        if (letter) {
          randomInput.value = letter
          randomInput.classList.add("bg-book-yellow")
        }
      }
    })
  }

  if (crosswordCheckBtn) {
    crosswordCheckBtn.addEventListener("click", () => {
      let allCorrect = true
      const inputs = document.querySelectorAll(".crossword-input")

      inputs.forEach((input) => {
        const row = Number.parseInt(input.dataset.row)
        const col = Number.parseInt(input.dataset.col)
        let correctLetter = ""

        // Check across words
        for (const [clueNum, answer] of Object.entries(crosswordAnswers.across)) {
          const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === Number.parseInt(clueNum))
          if (startCell) {
            const [startCoords, _] = startCell
            const [startRow, startCol] = startCoords.split(",").map(Number)

            if (row === startRow && col >= startCol && col < startCol + answer.length) {
              correctLetter = answer[col - startCol]
              break
            }
          }
        }

        // Check down words if letter not found
        if (!correctLetter) {
          for (const [clueNum, answer] of Object.entries(crosswordAnswers.down)) {
            const startCell = Object.entries(cellNumbers).find(([coords, num]) => num === Number.parseInt(clueNum))
            if (startCell) {
              const [startCoords, _] = startCell
              const [startRow, startCol] = startCoords.split(",").map(Number)

              if (col === startCol && row >= startRow && row < startRow + answer.length) {
                correctLetter = answer[row - startRow]
                break
              }
            }
          }
        }

        if (input.value.toUpperCase() === correctLetter) {
          input.classList.add("bg-green-100")
          input.classList.remove("bg-red-100")
        } else {
          input.classList.add("bg-red-100")
          input.classList.remove("bg-green-100")
          allCorrect = false
        }
      })

      if (allCorrect) {
        crosswordResult.innerHTML = `
                    <div class="bg-green-100 text-green-800 p-4 rounded-lg">
                        <p class="font-bold">Congratulations!</p>
                        <p>You've solved the crossword puzzle correctly!</p>
                    </div>
                `
        crosswordResult.classList.remove("hidden")
      } else {
        crosswordResult.innerHTML = `
                    <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                        <p class="font-bold">Almost there!</p>
                        <p>Some answers are incorrect. Red cells need to be fixed.</p>
                    </div>
                `
        crosswordResult.classList.remove("hidden")
      }
    })
  }

  // Helper function for Caesar cipher
  function caesarDecrypt(text, shift) {
    return text
      .split("")
      .map((char) => {
        if (char === " ") return " "
        const code = char.charCodeAt(0)
        if (code < 65 || code > 90) return char // Not A-Z

        let decrypted = code - shift
        if (decrypted < 65) decrypted += 26

        return String.fromCharCode(decrypted)
      })
      .join("")
  }

  // Fix the "Add to list" buttons in the book cards to add books to the reading list
  document.querySelectorAll(".book-card .bg-book-green").forEach((btn) => {
    btn.addEventListener("click", function () {
      const bookCard = this.closest(".book-card")
      const title = bookCard.querySelector("h3").textContent
      const author = bookCard.querySelector("p.text-gray-600").textContent.replace("by ", "")
      const cover = bookCard.querySelector("img").getAttribute("src")

      const book = {
        title: title,
        author: author,
        cover: cover,
      }

      const readingList = JSON.parse(localStorage.getItem("readingList")) || []

      if (!readingList.some((b) => b.title === book.title && b.author === book.author)) {
        readingList.push(book)
        localStorage.setItem("readingList", JSON.stringify(readingList))
        alert(`"${book.title}" added to your reading list!`)
        renderToReadList()
      } else {
        alert("This book is already in your reading list.")
      }
    })
  })

  // Add filter functionality to the book reviews section
  document.getElementById("apply-filters")?.addEventListener("click", () => {
    const genreFilter = document.getElementById("genre-filter").value
    const authorFilter = document.getElementById("author-filter").value.toLowerCase()
    const priceFilter = document.getElementById("price-filter").value
    const ratingFilter = Number.parseInt(document.getElementById("rating-filter").value)

    const bookCards = document.querySelectorAll(".book-card")

    bookCards.forEach((card) => {
      let showCard = true

      // Genre filter
      if (genreFilter && genreFilter !== "") {
        const genres = Array.from(card.querySelectorAll(".bg-book-green/20, .bg-book-orange/20, .bg-book-red/20")).map(
          (span) => span.textContent.toLowerCase(),
        )
        if (!genres.includes(genreFilter.toLowerCase())) {
          showCard = false
        }
      }

      // Author filter
      if (authorFilter && authorFilter !== "") {
        const author = card.querySelector("p.text-gray-600").textContent.toLowerCase()
        if (!author.includes(authorFilter)) {
          showCard = false
        }
      }

      // Price filter
      if (priceFilter && priceFilter !== "") {
        const hasFree = card.textContent.includes("Free")
        if (priceFilter === "free" && !hasFree) {
          showCard = false
        } else if (priceFilter === "paid" && hasFree) {
          showCard = false
        }
      }

      // Rating filter
      if (ratingFilter) {
        const ratingText = card.querySelector(".absolute.top-2.right-2").textContent
        const rating = Number.parseFloat(ratingText)
        if (rating < ratingFilter) {
          showCard = false
        }
      }

      // Show or hide the card
      card.style.display = showCard ? "" : "none"
    })
  })
})
