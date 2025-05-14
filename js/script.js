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

    // Load more books functionality
  const loadMoreButton = document.getElementById('load-more-books');
  const hiddenBooks = document.querySelectorAll('.hidden-book');
  
  if(loadMoreButton) {
    loadMoreButton.addEventListener('click', function() {
      let areAllBooksVisible = true;
      
      // Show hidden books with animation
      hiddenBooks.forEach((book, index) => {
        if(book.classList.contains('hidden-book')) {
          areAllBooksVisible = false;
          
          // Remove hidden class
          book.classList.remove('hidden-book');
          
          // Add display grid and animation
          book.style.display = 'block';
          book.classList.add('fade-in');
          
          // Stagger the animations slightly
          book.style.animationDelay = `${index * 0.1}s`;
        }
      });
      
      // If all books are now visible, change button text or hide it
      if(!areAllBooksVisible) {
        loadMoreButton.textContent = 'All Books Loaded';
        loadMoreButton.disabled = true;
        loadMoreButton.classList.add('bg-gray-400');
        loadMoreButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
      }
    });
  }

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

    // Update the completed count dynamically
    const countText = document.getElementById("completed-count")
    if (countText) {
      countText.textContent = completedList.length === 1
        ? "You have completed 1 book"
        : `You have completed ${completedList.length} books`
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


  // --- May Reading Challenge Modal & Genres Read Section ---

  const genreColors = {
    "Mystery": "bg-book-green/20 text-book-green",
    "Biography": "bg-book-orange/20 text-book-orange",
    "Sci-Fi": "bg-book-green/20 text-book-green",
    "Fantasy": "bg-book-red/20 text-book-red",
    "Historical": "bg-book-yellow/20 text-book-yellow"
  };
  const genres = ["Mystery", "Biography", "Sci-Fi", "Fantasy", "Historical"];

  // Keep checked genres in memory (or use localStorage for persistence)
  let checkedGenres = JSON.parse(localStorage.getItem("checkedGenres")) || [];

  // Render genres in the "Genres Read" section
  function renderGenresRead() {
    const container = document.getElementById("genres-read-list")
    if (!container) return
    container.innerHTML = checkedGenres.length
      ? checkedGenres
          .map((genre) => `<span class="px-2 py-1 rounded text-xs font-bold ${genreColors[genre]}">${genre}</span>`)
          .join("")
      : '<span class="text-gray-400 text-xs">No genres selected yet.</span>'

    // Update progress text and bar
    const progressText = document.getElementById("genre-progress-text")
    const progressBar = document.getElementById("genre-progress-bar")

    if (progressText && progressBar) {
      progressText.textContent = `${checkedGenres.length}/5 genres`
      const progressPercentage = (checkedGenres.length / 5) * 100
      progressBar.style.width = `${progressPercentage}%`
    }
  }

  // Modal creation
  function createChallengeModal() {
    // Remove any existing modal
    document.getElementById('challenge-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'challenge-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button id="close-challenge-modal" class="absolute top-2 right-2 text-gray-400 hover:text-book-red text-2xl font-bold">&times;</button>
        <h2 class="text-2xl font-bold text-book-dark mb-4">May Genre Challenge</h2>
        <div id="genre-checklist" class="flex flex-wrap gap-2 mb-4">
          ${genres.map((genre) => `
            <button type="button"
              class="genre-check-btn ${checkedGenres.includes(genre) ? genreColors[genre] : 'bg-gray-200 text-gray-500'} px-2 py-1 rounded text-xs flex items-center transition-colors"
              data-genre="${genre}">
              <span>${genre}</span>
              <span class="ml-1 genre-tick" style="display:${checkedGenres.includes(genre) ? 'inline' : 'none'}">&#10003;</span>
            </button>
          `).join('')}
        </div>
        <div class="mt-6 text-right">
          <button id="close-challenge-modal-2" class="bg-book-green hover:bg-book-dark text-white font-bold py-2 px-4 rounded-full transition-colors">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close modal handlers
    document.getElementById('close-challenge-modal').onclick = () => modal.remove();
    document.getElementById('close-challenge-modal-2').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    // Checklist logic
    modal.querySelectorAll('.genre-check-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const genre = this.getAttribute('data-genre');
        const tick = this.querySelector('.genre-tick');
        const isChecked = checkedGenres.includes(genre);

        if (isChecked) {
          checkedGenres = checkedGenres.filter(g => g !== genre);
          this.className = "genre-check-btn bg-gray-200 text-gray-500 px-2 py-1 rounded text-xs flex items-center transition-colors";
          tick.style.display = 'none';
        } else {
          checkedGenres.push(genre);
          this.className = `genre-check-btn ${genreColors[genre]} px-2 py-1 rounded text-xs flex items-center transition-colors`;
          tick.style.display = 'inline';
        }
        renderGenresRead();
      });
    });
  }

  // Attach event listener to the "View Details" button
  const viewDetailsBtn = document.querySelector('#challenges button.bg-book-green');
  if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createChallengeModal();
    });
  }

  // Initial render
  renderGenresRead();


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

  // Load More Books functionality
  const loadMoreBooksBtn = document.querySelector(".book-reviews .mt-8 button")
  if (loadMoreBooksBtn) {
    // Track if additional books have been loaded
    let additionalBooksLoaded = false

    loadMoreBooksBtn.addEventListener("click", () => {
      if (additionalBooksLoaded) {
        alert("No more books to load at this time.")
        return
      }

      const bookGrid = document.querySelector(".book-reviews .grid")
      if (bookGrid) {
        // Create HTML for 3 additional books
        const additionalBooks = `
          <!-- Book Card 4 -->
          <div class="book-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div class="relative">
              <img src="images/verity.jpg" alt="Book Cover" class="rounded-lg shadow-md h-full w-full object-cover">
              <div class="absolute top-2 right-2 bg-book-yellow text-book-dark px-2 py-1 rounded font-bold">
                4.3 ★
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-xl mb-1">Verity</h3>
              <p class="text-gray-600 mb-2">by Colleen Hoover</p>
              <div class="flex mb-3">
                <span class="bg-book-green/20 text-book-green px-2 py-1 rounded text-sm mr-2">Thriller</span>
                <span class="bg-book-red/20 text-book-red px-2 py-1 rounded text-sm">Romance</span>
              </div>
              <p class="text-gray-700 text-sm mb-4">
                Lowen Ashleigh is a struggling writer on the brink of financial ruin when she accepts the job offer of a lifetime. Jeremy Crawford, husband of bestselling author Verity Crawford, has hired Lowen to complete the remaining books in a successful series his injured wife is unable to finish.
              </p>
              <div class="mb-4">
                <h4 class="font-bold text-book-dark text-sm mb-1">Where to Read:</h4>
                <div class="flex flex-wrap gap-1">
                  <a href="#" class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs hover:bg-orange-200 transition-colors">
                    Amazon Kindle
                  </a>
                  <a href="#" class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs hover:bg-purple-200 transition-colors">
                    Google Books
                  </a>
                </div>
              </div>
              <div class="flex justify-between">
                <button class="bg-book-green hover:bg-book-dark text-white font-bold py-1 px-4 rounded-full text-sm transition-colors">
                  Add to List
                </button>
                <button class="bg-book-orange hover:bg-book-red text-white font-bold py-1 px-4 rounded-full text-sm transition-colors">
                  Full Review
                </button>
              </div>
            </div>
          </div>
          
          <!-- Book Card 5 -->
          <div class="book-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div class="relative">
              <img src="images/song-of-achilles.jpg" alt="Book Cover" class="rounded-lg shadow-md h-full w-full object-cover">
              <div class="absolute top-2 right-2 bg-book-yellow text-book-dark px-2 py-1 rounded font-bold">
                4.6 ★
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-xl mb-1">The Song of Achilles</h3>
              <p class="text-gray-600 mb-2">by Madeline Miller</p>
              <div class="flex mb-3">
                <span class="bg-book-green/20 text-book-green px-2 py-1 rounded text-sm mr-2">Historical</span>
                <span class="bg-book-orange/20 text-book-orange px-2 py-1 rounded text-sm">Fantasy</span>
              </div>
              <p class="text-gray-700 text-sm mb-4">
                Greece in the age of heroes. Patroclus, an awkward young prince, has been exiled to the court of King Peleus and his perfect son Achilles. By all rights their paths should never cross, but Achilles takes the shamed prince as his friend, and as they grow into young men skilled in the arts of war and medicine.
              </p>
              <div class="mb-4">
                <h4 class="font-bold text-book-dark text-sm mb-1">Where to Read:</h4>
                <div class="flex flex-wrap gap-1">
                  <a href="#" class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors">
                    <span class="font-bold">Free</span> - Library
                  </a>
                  <a href="#" class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs hover:bg-orange-200 transition-colors">
                    Amazon Kindle
                  </a>
                </div>
              </div>
              <div class="flex justify-between">
                <button class="bg-book-green hover:bg-book-dark text-white font-bold py-1 px-4 rounded-full text-sm transition-colors">
                  Add to List
                </button>
                <button class="bg-book-orange hover:bg-book-red text-white font-bold py-1 px-4 rounded-full text-sm transition-colors">
                  Full Review
                </button>
              </div>
            </div>
          </div>
          
          <!-- Book Card 6 -->
          <div class="book-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div class="relative">
              <img src="images/seven-husbands.jpg" alt="Book Cover" class="rounded-lg shadow-md h-full w-full object-cover">
              <div class="absolute top-2 right-2 bg-book-yellow text-book-dark px-2 py-1 rounded font-bold">
                4.4 ★
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-xl mb-1">The Seven Husbands of Evelyn Hugo</h3>
              <p class="text-gray-600 mb-2">by Taylor Jenkins Reid</p>
              <div class="flex mb-3">
                <span class="bg-book-green/20 text-book-green px-2 py-1 rounded text-sm mr-2">Fiction</span>
                <span class="bg-book-red/20 text-book-red px-2 py-1 rounded text-sm">Historical</span>
              </div>
              <p class="text-gray-700 text-sm mb-4">
                Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself.
              </p>
              <div class="mb-4">
                <h4 class="font-bold text-book-dark text-sm mb-1">Where to Read:</h4>
                <div class="flex flex-wrap gap-1">
                  <a href="#" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors">
                    <span class="font-bold">Free</span> - Open Library
                  </a>
                  <a href="#" class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs hover:bg-purple-200 transition-colors">
                    Google Books
                  </a>
                </div>
              </div>
              <div class="flex justify-between">
                <button class="bg-book-green hover:bg-book-dark text-white font-bold py-1 px-4 rounded-full text-sm transition-colors">
                  Add to List
                </button>
                <button class="bg-book-orange hover:bg-book-red text-white font-bold py-1 px-4 rounded-full text-sm transition-colors">
                  Full Review
                </button>
              </div>
            </div>
          </div>
        `

        // Append the new books to the grid
        bookGrid.innerHTML += additionalBooks

        // Mark as loaded
        additionalBooksLoaded = true

        // Update button text
        loadMoreBooksBtn.textContent = "All Books Loaded"

        // Add event listeners to the new "Add to List" buttons
        document.querySelectorAll(".book-card .bg-book-green").forEach((btn) => {
          if (!btn.hasAttribute("data-initialized")) {
            btn.setAttribute("data-initialized", "true")
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
          }
        })
      }
    })
  }

})

