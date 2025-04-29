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
    const authButtons = document.querySelector(".auth-buttons");
    if (user) {
      authButtons.style.display = "flex";

      // Hide Sign In and Register buttons explicitly if there is logout btn
      const signInBtn = authButtons.querySelector(".sign-in");
      const registerBtn = authButtons.querySelector(".register");
      if (signInBtn) signInBtn.style.display = "none";
      if (registerBtn) registerBtn.style.display = "none";

      createLogoutButton(); // add logout button if missing
    } else {
      authButtons.style.display = "flex";

      // Show Sign In and Register buttons
      const signInBtn = authButtons.querySelector(".sign-in");
      const registerBtn = authButtons.querySelector(".register");
      if (signInBtn) signInBtn.style.display = "inline-block";
      if (registerBtn) registerBtn.style.display = "inline-block";

      // Remove logout button if any
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) logoutBtn.remove();
    }
  }

  // Check if user is already logged in on page load
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

  // ----- Fetch and Render Vehicles Dynamically -----
  async function loadVehicles() {
    const vehicleContainer = document.getElementById("vehicleContainer");
    if (!vehicleContainer) return;

    try {
      const vehicles = await Backendless.Data.of("vehicles").find();

      vehicleContainer.innerHTML = ""; // Clear previous vehicles

      vehicles.forEach((vehicle) => {
        const card = document.createElement("div");
        card.className = "vehicle-card";

        const imageUrl = vehicle.imageUrl || "placeholder.svg";

        card.innerHTML = `
          <div class="vehicle-image">
            <img src="${imageUrl}" alt="${vehicle.model}">
          </div>
          <div class="vehicle-details">
            <div class="vehicle-info">
              <h3>${vehicle.carType}</h3>
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
          const carTypeRadio = document.querySelector(`input[name="carType"][value="${selectedCarType}"]`);
          if (carTypeRadio) carTypeRadio.checked = true;

          const bookingFormSection = document.getElementById("booking");
          if (bookingFormSection) {
            window.scrollTo({
              top: bookingFormSection.offsetTop - 70,
              behavior: "smooth",
            });
          }
        });
      });
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  }
  loadVehicles();

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
      const carType = document.querySelector('input[name="carType"]:checked').value;

      if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
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

        // Check for overlapping bookings of this user
        const whereClause = `
          custld = '${currentUser.objectId}' AND
          pickupDatetime <= '${dropoffDateTime.toISOString()}' AND
          dropDatetime >= '${pickupDateTime.toISOString()}'
        `;

        const overlappingBookings = await Backendless.Data.of("bookings").find({
          whereClause: whereClause,
        });

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

    // Booking date min setup (your existing logic)
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
