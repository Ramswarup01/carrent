document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navLinks = document.getElementById("navLinks")

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active")

      // Toggle icon between bars and times
      const icon = mobileMenuBtn.querySelector("i")
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for header height
          behavior: "smooth",
        })

        // Close mobile menu if open
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active")
          const icon = mobileMenuBtn.querySelector("i")
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      }
    })
  })

  // Booking form validation
  const bookingForm = document.getElementById("carBookingForm")
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const pickupLocation = document.getElementById("pickupLocation").value
      const dropoffLocation = document.getElementById("dropoffLocation").value
      const pickupDate = document.getElementById("pickupDate").value
      const pickupTime = document.getElementById("pickupTime").value
      const dropoffDate = document.getElementById("dropoffDate").value
      const dropoffTime = document.getElementById("dropoffTime").value
      const carType = document.querySelector('input[name="carType"]:checked').value

      // Basic validation
      if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
        alert("Please fill in all required fields")
        return
      }

      // Check if pickup date is not in the past
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const pickup = new Date(pickupDate)

      if (pickup < today) {
        alert("Pickup date cannot be in the past")
        return
      }

      // Check if dropoff date is after pickup date
      const dropoff = new Date(dropoffDate)
      if (dropoff < pickup) {
        alert("Drop-off date must be after pickup date")
        return
      }

      // If all validation passes, show success message
      alert(
        `Booking request submitted successfully!\n\nPickup: ${pickupLocation} on ${pickupDate} at ${pickupTime}\nDrop-off: ${dropoffLocation} on ${dropoffDate} at ${dropoffTime}\nCar Type: ${carType}`,
      )

      // Reset form
      bookingForm.reset()
    })

    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("pickupDate").min = today
    document.getElementById("dropoffDate").min = today

    // Update dropoff date min value when pickup date changes
    document.getElementById("pickupDate").addEventListener("change", function () {
      document.getElementById("dropoffDate").min = this.value

      // If dropoff date is before new pickup date, update it
      if (document.getElementById("dropoffDate").value < this.value) {
        document.getElementById("dropoffDate").value = this.value
      }
    })
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
