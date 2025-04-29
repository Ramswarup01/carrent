document.addEventListener("DOMContentLoaded", () => {
  // ----- Backendless Initialization -----
  Backendless.initApp(
    "A33C4544-3EA3-40F5-9373-C30AD3163696",
    "00582F4D-AA36-4053-8D41-2C6C9F9C4F03"
  );

  // ----- Mobile menu toggle -----
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // ----- Smooth scrolling for navigation links -----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth",
        });

        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          const icon = mobileMenuBtn.querySelector("i");
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  });

  // ----- Authentication UI Elements -----
  const signInFormDiv = document.getElementById("signInForm");
  const registerFormDiv = document.getElementById("registerForm");
  const authModal = document.getElementById("authModal");
  const showRegisterBtn = document.getElementById("showRegister");
  const showSignInBtn = document.getElementById("showSignIn");
  const signInBtn = document.querySelector(".sign-in");
  const registerBtn = document.querySelector(".register");
  const authButtons = document.querySelector(".auth-buttons");

  // ----- Open/Close Auth Modal -----
  function openAuthModal() {
    authModal.style.display = "block";
  }
  function closeAuthModal() {
    authModal.style.display = "none";
  }

  if (signInBtn) signInBtn.addEventListener("click", () => {
    showSignInForm();
    openAuthModal();
  });

  if (registerBtn) registerBtn.addEventListener("click", () => {
    showRegisterForm();
    openAuthModal();
  });

  window.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // ----- Switch Auth Forms -----
  showRegisterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showRegisterForm();
  });

  showSignInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showSignInForm();
  });

  function showRegisterForm() {
    signInFormDiv.style.display = "none";
    registerFormDiv.style.display = "block";
  }
  function showSignInForm() {
    registerFormDiv.style.display = "none";
    signInFormDiv.style.display = "block";
  }

  // ----- User Session Management -----
  function updateUIForUser(user) {
    if (user) {
      authButtons.style.display = "none";
      // Optionally show user info or logout button here
    } else {
      authButtons.style.display = "flex";
    }
  }

  // Check if user is already logged in
  Backendless.UserService.isValidLogin().then(isValid => {
    if (isValid) {
      Backendless.UserService.getCurrentUser().then(user => {
        updateUIForUser(user);
      });
    } else {
      updateUIForUser(null);
    }
  });

  // ----- Register Form Submission -----
  const register = document.getElementById("register");
  if (register) {
    register.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("registerName").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value;

      if (!name || !email || !password) {
        alert("Please fill in all fields!");
        return;
      }

      try {
        const user = new Backendless.User();
        user.email = email;
        user.password = password;
        user.name = name;

        const registeredUser = await Backendless.UserService.register(user);
        alert(`Registered successfully: ${registeredUser.email}`);

        register.reset();
        showSignInForm();
      } catch (error) {
        alert("Registration failed: " + (error.message || error));
      }
    });
  }

  // ----- Sign-In Form Submission -----
  const signIn = document.getElementById("signIn");
  if (signIn) {
    signIn.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signInEmail").value.trim();
      const password = document.getElementById("signInPassword").value;

      if (!email || !password) {
        alert("Please fill in all fields!");
        return;
      }

      try {
        const loggedInUser = await Backendless.UserService.login(email, password, true);
        alert(`Signed in as: ${loggedInUser.email}`);
        updateUIForUser(loggedInUser);
        closeAuthModal();
      } catch (error) {
        alert("Error signing in: " + (error.message || error));
      }
    });
  }

  // ----- Booking Form Submission -----
  const bookingForm = document.getElementById("carBookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form values
      const pickupLocation = document.getElementById("pickupLocation").value;
      const dropoffLocation = document.getElementById("dropoffLocation").value;
      const pickupDate = document.getElementById("pickupDate").value;
      const pickupTime = document.getElementById("pickupTime").value;
      const dropoffDate = document.getElementById("dropoffDate").value;
      const dropoffTime = document.getElementById("dropoffTime").value;
      const carType = document.querySelector('input[name="carType"]:checked').value;

      if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
        alert("Please fill in all required fields");
        return;
      }

      const pickupDateTime = new Date(pickupDate + "T" + pickupTime);
      const dropoffDateTime = new Date(dropoffDate + "T" + dropoffTime);

      // Validate dates
      if (pickupDateTime < new Date()) {
        alert("Pickup date/time cannot be in the past");
        return;
      }
      if (dropoffDateTime <= pickupDateTime) {
        alert("Drop-off date/time must be after pickup date/time");
        return;
      }

      try {
        // Get logged in user info
        const currentUser = await Backendless.UserService.getCurrentUser();

        if (!currentUser) {
          alert("Please sign in before making a booking");
          return;
        }

        // Prepare booking data object matching backendless bookings table
        const bookingData = {
          carld: carType,
          pickupLocation,
          dropoffLocation,
          pickupDatetime: pickupDateTime.toISOString(),
          dropDatetime: dropoffDateTime.toISOString(),
          custld: currentUser.objectId,
          usermail: currentUser.email,
          ContactNumber: currentUser.contact || "", // if you store contact; else empty
        };

        await Backendless.Data.of("bookings").save(bookingData);

        alert("Booking submitted successfully!");
        bookingForm.reset();
      } catch (error) {
        alert("Failed to submit booking: " + (error.message || error));
      }
    });

    // Minimum date setup and dropoff date adjustments (keep your existing code)
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("pickupDate").min = today;
    document.getElementById("dropoffDate").min = today;

    document.getElementById("pickupDate").addEventListener("change", function () {
      document.getElementById("dropoffDate").min = this.value;
      if (document.getElementById("dropoffDate").value < this.value) {
        document.getElementById("dropoffDate").value = this.value;
      }
    });
  }



  

  // Reviews slider functionality
  const reviewCards = document.querySelectorAll(".review-card")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.getElementById("prevReview")
  const nextBtn = document.getElementById("nextReview")

  if (reviewCards.length > 0 && dots.length > 0) {
    let currentIndex = 0

    // Function to show review at specific index
    function showReview(index) {
      // Hide all reviews
      reviewCards.forEach((card) => {
        card.classList.remove("active")
      })

      // Deactivate all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })

      // Show current review and activate current dot
      reviewCards[index].classList.add("active")
      dots[index].classList.add("active")

      currentIndex = index
    }

    // Next button click
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        let nextIndex = currentIndex + 1
        if (nextIndex >= reviewCards.length) {
          nextIndex = 0
        }
        showReview(nextIndex)
      })
    }

    // Previous button click
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        let prevIndex = currentIndex - 1
        if (prevIndex < 0) {
          prevIndex = reviewCards.length - 1
        }
        showReview(prevIndex)
      })
    }

    // Dot clicks
    dots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        showReview(index)
      })
    })

    // Auto-rotate reviews every 5 seconds
    setInterval(() => {
      let nextIndex = currentIndex + 1
      if (nextIndex >= reviewCards.length) {
        nextIndex = 0
      }
      showReview(nextIndex)
    }, 5000)
  }

  // Book Now buttons functionality
  const bookNowBtns = document.querySelectorAll(".book-now-btn")
  bookNowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Scroll to booking form
      const bookingForm = document.getElementById("booking")
      if (bookingForm) {
        window.scrollTo({
          top: bookingForm.offsetTop - 70,
          behavior: "smooth",
        })
      }
    })
  })

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const emailInput = this.querySelector('input[type="email"]')
      if (emailInput && emailInput.value) {
        alert(`Thank you for subscribing with: ${emailInput.value}`)
        emailInput.value = ""
      }
    })
  }
})





// Getting references to the modal and forms
  const signInForm = document.getElementById("signInForm");
  const registerForm = document.getElementById("registerForm");
  const authModal = document.getElementById("authModal");
  const showRegisterBtn = document.getElementById("showRegister");
  const showSignInBtn = document.getElementById("showSignIn");

  // Open the modal
  const openAuthModal = () => {
    authModal.style.display = "block";
  };

  // Close the modal
  const closeAuthModal = () => {
    authModal.style.display = "none";
  };

  // Show Register form
  showRegisterBtn.addEventListener("click", () => {
    signInForm.style.display = "none";
    registerForm.style.display = "block";
  });

  // Show Sign In form
  showSignInBtn.addEventListener("click", () => {
    registerForm.style.display = "none";
    signInForm.style.display = "block";
  });

  // Close the modal when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });

  // Form validation (basic frontend validation)
  const signIn = document.getElementById("signIn");
  const register = document.getElementById("register");

  // Sign-In form submission
  signIn && signIn.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signInEmail").value;
    const password = document.getElementById("signInPassword").value;

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    // Mock sign-in (just for frontend validation)
    alert(`Signing in with: ${email}`);
  });

  // Register form submission
  register && register.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    // Mock registration (just for frontend validation)
    alert(`Registering with: ${name}, ${email}`);
  });

  // Example of opening the modal (you can trigger this on a button click or link)
  const signInLink = document.getElementById("signInLink");
  if (signInLink) {
    signInLink.addEventListener("click", openAuthModal);
  }
});
