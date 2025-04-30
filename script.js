document.addEventListener("DOMContentLoaded", () => {
  // ----- Backendless Initialization -----
  Backendless.initApp(
    "A33C4544-3EA3-40F5-9373-C30AD3163696",
    "00582F4D-AA36-4053-8D41-2C6C9F9C4F03"
  );

  // ----- Mobile Menu Toggle -----
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });
  }

  // ----- Smooth Scrolling for Navigation Links -----
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
  const authModal = document.getElementById("authModal");
  const signInFormDiv = document.getElementById("signInForm");
  const registerFormDiv = document.getElementById("registerForm");
  const showRegisterBtn = document.getElementById("showRegister");
  const showSignInBtn = document.getElementById("showSignIn");
  const signInBtn = document.querySelector(".sign-in");
  const registerBtn = document.querySelector(".register");

  function openAuthModal() {
    authModal.style.display = "block";
  }
  function closeAuthModal() {
    authModal.style.display = "none";
  }
  function showRegisterForm() {
    signInFormDiv.style.display = "none";
    registerFormDiv.style.display = "block";
  }
  function showSignInForm() {
    registerFormDiv.style.display = "none";
    signInFormDiv.style.display = "block";
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

  // Add event listeners for form switching
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showRegisterForm();
    });
  }

  if (showSignInBtn) {
    showSignInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSignInForm();
    });
  }

  // ----- User Session Management -----
  function updateUIForUser(user) {
    const authButtons = document.querySelector(".auth-buttons");
    if (user) {
      authButtons.style.display = "flex";

      const signInBtn = authButtons.querySelector(".sign-in");
      const registerBtn = authButtons.querySelector(".register");
      if (signInBtn) signInBtn.style.display = "none";
      if (registerBtn) registerBtn.style.display = "none";

      createLogoutButton();
    } else {
      authButtons.style.display = "flex";

      const signInBtn = authButtons.querySelector(".sign-in");
      const registerBtn = authButtons.querySelector(".register");
      if (signInBtn) signInBtn.style.display = "inline-block";
      if (registerBtn) registerBtn.style.display = "inline-block";

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) logoutBtn.remove();
    }
  }

  Backendless.UserService.isValidLogin().then((isValid) => {
    if (isValid) {
      Backendless.UserService.getCurrentUser().then((user) => {
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
      const contact = document.getElementById("registerContact").value.trim();
      const password = document.getElementById("registerPassword").value.trim();

      if (!name || !email || !contact || !password) {
        alert("Please fill in all fields!");
        return;
      }

      try {
        const user = new Backendless.User();
        user.email = email;
        user.password = password;
        user.name = name;
        user.contact = contact;

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

  // ----- Logout Button & Session Management -----
  function createLogoutButton() {
    const authButtons = document.querySelector(".auth-buttons");
    let logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) {
      logoutBtn = document.createElement("button");
      logoutBtn.id = "logoutBtn";
      logoutBtn.textContent = "Logout";
      logoutBtn.style.backgroundColor = "white";
      logoutBtn.style.color = "#007BFF";
      logoutBtn.style.border = "none";
      logoutBtn.style.padding = "0.5rem 1.2rem";
      logoutBtn.style.borderRadius = "4px";
      logoutBtn.style.cursor = "pointer";
      logoutBtn.style.fontWeight = "500";
      logoutBtn.style.marginLeft = "10px";
      authButtons.appendChild(logoutBtn);

      logoutBtn.addEventListener("click", async () => {
        try {
          await Backendless.UserService.logout();
          alert("Logged out successfully");
          updateUIForUser(null);
        } catch (error) {
          alert("Error during logout: " + (error.message || error));
        }
      });
    }
  }

  
  // Event listener for 'Book Ride' button
    const bookRideButton = document.querySelector(".book-ride");
  if (bookRideButton) {
    bookRideButton.addEventListener("click", () => {
      const bookingFormSection = document.getElementById("booking");
      if (bookingFormSection) {
        bookingFormSection.style.display = "block"; // Ensure booking form is visible
        window.scrollTo({
          top: bookingFormSection.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  }
  
  // ----- Fetch and Render Vehicles Dynamically -----
  async function loadVehicles(showAll = false) {
    const vehicleContainer = document.getElementById("vehicleContainer");
    const carTypeSelect = document.getElementById("carTypeSelect");
    if (!vehicleContainer) return;

    try {
      const vehicles = await Backendless.Data.of("vehicles").find();

      vehicleContainer.innerHTML = ""; // Clear previous vehicles
      carTypeSelect.innerHTML = '<option value="">Choose car type...</option>'; // Reset car types
    
      const vehiclesToShow = showAll ? vehicles : vehicles.slice(0, 3);
      vehiclesToShow.forEach((vehicle) => {
        const card = document.createElement("div");
        card.className = "vehicle-card";

        const imageUrl = vehicle.imageUrl || "placeholder.svg";

        // Populate the car types in the dropdown
        if (!carTypeSelect.querySelector(`option[value="${vehicle.carType}"]`)) {
          const option = document.createElement("option");
          option.value = vehicle.carType.toLowerCase();
          option.textContent = vehicle.carType;
          carTypeSelect.appendChild(option);
        }

        card.innerHTML = `
          <div class="vehicle-image">
            <img src="${imageUrl}" alt="${vehicle.model}">
          </div>
          <div class="vehicle-details">
            <div class="vehicle-info">
              <h3>${vehicle.model}</h3>
              <div class="price">₹${vehicle.price}<span>/day</span></div>
            </div>
            <div class="vehicle-specs">
              <div class="spec"><i class="fas fa-car"></i> ${vehicle.model}</div>
              <div class="spec"><i class="fas fa-gas-pump"></i> ${vehicle.fuelType}</div>
              <div class="spec"><i class="fas fa-cog"></i> ${vehicle.transmission}</div>
            </div>
            <button class="book-now-btn" data-car-type="${vehicle.carType}">Book Now</button>
          </div>
        `;

        vehicleContainer.appendChild(card);
      });

      const bookNowBtns = vehicleContainer.querySelectorAll(".book-now-btn");
      bookNowBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const selectedCarType = btn.getAttribute("data-car-type");
          const carTypeOption = carTypeSelect.querySelector(`option[value="${selectedCarType.toLowerCase()}"]`);
          if (carTypeOption) carTypeOption.selected = true;

          const bookingFormSection = document.getElementById("booking");
          if (bookingFormSection) {
            bookingFormSection.style.display = "block"; // Show booking form
            window.scrollTo({
              top: bookingFormSection.offsetTop - 70,
              behavior: "smooth",
            });
          }
        });
      });

      const viewAllBtn = document.querySelector(".view-all-btn");
      if (viewAllBtn && vehicles.length > 3) {
        viewAllBtn.style.display = showAll ? "none" : "block";
        viewAllBtn.addEventListener("click", () => loadVehicles(true));
      }

    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  }
  loadVehicles();

  // ----- Review Slider Functionality -----
  let currentReviewIndex = 0;
  const reviews = document.querySelectorAll('.review-card');
  const dots = document.querySelectorAll('.review-dots .dot');

  function showReview(index) {
    reviews.forEach((review, i) => {
      review.style.display = (i === index) ? "block" : "none";
      dots[i].classList.toggle("active", i === index);
    });
  }

  document.getElementById("prevReview").addEventListener("click", () => {
    currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
    showReview(currentReviewIndex);
  });

  document.getElementById("nextReview").addEventListener("click", () => {
    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
    showReview(currentReviewIndex);
  });

  showReview(currentReviewIndex); // Initialize the first review

  // ----- Booking Form Submission with Overlap Validation -----
  const bookingForm = document.getElementById("carBookingForm");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const pickupLocation = document.getElementById("pickupLocation").value;
      const dropoffLocation = document.getElementById("dropoffLocation").value;
      const pickupDate = document.getElementById("pickupDate").value;
      const pickupTime = document.getElementById("pickupTime").value;
      const dropoffDate = document.getElementById("dropoffDate").value;
      const dropoffTime = document.getElementById("dropoffTime").value;
      const carType = document.getElementById("carTypeSelect").value;

      if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime || !carType) {
        alert("Please fill in all required fields");
        return;
      }

      const pickupDateTime = new Date(pickupDate + "T" + pickupTime);
      const dropoffDateTime = new Date(dropoffDate + "T" + dropoffTime);

      if (pickupDateTime < new Date()) {
        alert("Pickup date/time cannot be in the past");
        return;
      }
      if (dropoffDateTime <= pickupDateTime) {
        alert("Drop-off date/time must be after pickup date/time");
        return;
      }

      try {
        const currentUser = await Backendless.UserService.getCurrentUser();

        if (!currentUser) {
          alert("Please sign in before making a booking");
          return;
        }

        const whereClause = `
          custld = '${currentUser.objectId}' AND
          pickupDatetime <= '${dropoffDateTime.toISOString()}' AND
          dropDatetime >= '${pickupDateTime.toISOString()}'
        `;

        const overlappingBookings = await Backendless.Data.of("bookings").find({ whereClause });

        if (overlappingBookings.length > 0) {
          alert("You already have a booking during this period. Please finish or cancel it before making a new booking.");
          return;
        }

        const bookingData = {
          carld: carType,
          pickupLocation,
          dropoffLocation,
          pickupDatetime: pickupDateTime.toISOString(),
          dropDatetime: dropoffDateTime.toISOString(),
          custld: currentUser.objectId,
          usermail: currentUser.email,
          ContactNumber: currentUser.contact || "",
        };

        await Backendless.Data.of("bookings").save(bookingData);

        alert("Booking submitted successfully!");
        bookingForm.reset();
      } catch (error) {
        alert("Failed to submit booking: " + (error.message || error));
      }
    });

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
});
