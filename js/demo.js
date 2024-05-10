const optionIcon = document.querySelector(".options .option-icon");
const optionsDialog = document.querySelector(".options");
const colorsList = document.querySelectorAll(".options .settings ul li");
const ulColorsOptions = document.querySelector(".options .settings ul ");
const landingPage = document.querySelector(".landing-page ");
const answers = document.querySelector(".settings .answers");
const answersChildren = document.querySelectorAll(".settings .answers span");
const resetBtn = document.querySelector(".settings .reset button");
const meals = document.querySelector(".meals");
const btn = document.querySelector(".introduction-text button");
const mealSpans = document.querySelectorAll(
	".meals .meal-box .meal-progress span "
);
const bulletContainer = document.querySelector(".bullets");
const bullets = document.querySelectorAll(".bullets span.bullet");
const menuImgs = document.querySelectorAll(".menu .container .menu-item img");
const imageOverlay = document.querySelector(".menu .image-popup");
const allSections = document.querySelectorAll("section");
const toggleMenuIcon = document.querySelector(".toggle-menu .toggle-icon");
const headerMenu = document.querySelector(".landing-page .header ul");

const root = document.documentElement;

/** Default Options Values */

const DEFAULT_OPTIONS = {
	themeColor: "#d0583e",
	isBackgroundChanged: "No",
	isBulletVisible: false,
};
// backgroundImgs List
const backgroundImgs = ["1.jpg", "8.jpg", "9.jpg", "10.jpg"];

let backgroundInterval;
let intervalRunning = false;

const changeBackground = () => {
	let randomIndex;
	if (!intervalRunning) {
		console.log("interval opend");
		backgroundInterval = setInterval(() => {
			randomIndex = Math.floor(Math.random() * backgroundImgs.length);
			landingPage.style.backgroundImage = `url(../images/${backgroundImgs[randomIndex]})`;
			intervalRunning = true;
		}, 10000);
	}
};

const removeActiveClassFromAllChildren = (parentElement) => {
	const childrenList = Array.from(parentElement.children);
	childrenList.forEach((child) => {
		child.classList.remove("active");
	});
};

const addActiveClass = (element) => element.classList.add("active");

// retrieve Options From LocalStorage and set config
const setOptionsOnRefresh = () => {
	let themeColor = localStorage.getItem("themeColor");
	let isBackgroundChanged = localStorage.getItem("isBackgroundChanged");
	themeColor
		? root.style.setProperty("--main-color", themeColor)
		: (themeColor = DEFAULT_OPTIONS.themeColor);

	if (isBackgroundChanged == null) {
		localStorage.setItem(
			"isBackgroundChanged",
			DEFAULT_OPTIONS.isBackgroundChanged
		);

		isBackgroundChanged = DEFAULT_OPTIONS.isBackgroundChanged;
	}

	removeActiveClassFromAllChildren(ulColorsOptions);
	removeActiveClassFromAllChildren(answers);

	colorsList.forEach((color) => {
		color.dataset.color == themeColor ? addActiveClass(color) : null;
	});

	answersChildren.forEach((answer) => {
		answer.textContent === isBackgroundChanged ? addActiveClass(answer) : null;
		answer.textContent == "Yes" && isBackgroundChanged == "Yes"
			? changeBackground()
			: null;

		answer.textContent == "No" && isBackgroundChanged == "No"
			? clearInterval(backgroundInterval)
			: null;
	});
};

setOptionsOnRefresh();
/** Change Background */

// Show Option Box when click on setting icon
const showOptionDialog = () => optionsDialog.classList.toggle("open");

optionIcon.addEventListener("click", showOptionDialog);

/** Change Theme Color based on selected color */

colorsList.forEach((color) => {
	color.addEventListener("click", () => {
		root.style.setProperty("--main-color", color.dataset.color);
		removeActiveClassFromAllChildren(ulColorsOptions);
		addActiveClass(color);
		localStorage.setItem("themeColor", color.dataset.color);
	});
});

/** Change Background Options */
answersChildren.forEach((answer) => {
	answer.addEventListener("click", () => {
		if (answer.textContent == "Yes") {
			changeBackground();
		} else {
			clearInterval(backgroundInterval);
			intervalRunning = false;
		}

		removeActiveClassFromAllChildren(answers);
		addActiveClass(answer);
		localStorage.setItem("isBackgroundChanged", answer.textContent);
	});
});
const resetOptions = () => {
	localStorage.setItem("themeColor", DEFAULT_OPTIONS.themeColor);
	localStorage.setItem(
		"isBackgroundChanged",
		DEFAULT_OPTIONS.isBackgroundChanged
	);
	setOptionsOnRefresh();
};

/** Reset Button */
resetBtn.addEventListener("click", resetOptions);
/** fill meal span width  when meals reached*/
window.onscroll = function () {
	const mealsOffsetTop = meals.offsetTop;
	// to get meals hight
	const mealsSectionHight = meals.offsetHeight;
	// window height
	const windowHight = window.innerHeight;

	const windowScrollTop = window.scrollY;

	if (windowScrollTop > mealsSectionHight + mealsOffsetTop - windowHight) {
		mealSpans.forEach((meal) => {
			meal.style.width = meal.dataset.progress;
		});
	}
};
// close popup
const closePopup = () => {
	console.log("Closed");
	imageOverlay.style.display = "none";
};
/** Show Popup on Click on menu image */
const showPopup = (img) => {
	imageOverlay.style.display = "block";
	let popup = createNewElement("div", "class", "popup");
	let closeIcon = createNewElement("div", "class", "closeIcon");
	closeIcon.innerHTML = "<i class='fa-solid fa-xmark'></i>";
	closeIcon.addEventListener("click", closePopup);

	let h2 = createNewElement(
		"h2",
		"class",
		"popup-text",
		img.getAttribute("alt")
	);
	let p = createNewElement(
		"p",
		"class",
		"popup-description",
		"Lorem ipsum dolor sit amet consectetur adipisicing elit."
	);

	let newImg = createNewElement("img", "src", img.getAttribute("src"));

	popup.append(closeIcon, h2, newImg, p);
	imageOverlay.append(popup);
};

function showMenuDetails() {
	menuImgs.forEach((img) => {
		img.addEventListener("click", () => {
			showPopup(img);
		});
	});
}

const createNewElement = (element, attr, attrValu, textContent) => {
	let newElement = document.createElement(element);
	attr ? newElement.setAttribute(attr, attrValu) : null;
	textContent ? (newElement.textContent = textContent) : null;
	return newElement;
};

showMenuDetails();
const goToSection = (element) => {
	document.querySelector(`.${element}`).scrollIntoView({ behavior: "smooth" });
};

const createNavigationBullets = () => {
	allSections.forEach((section) => {
		// console.log(section.classList[0]);
		let spanContent =
			section.classList[0][0].toUpperCase() + section.classList[0].slice(1);

		let span = createNewElement("span", "class", "bullet");
		let innerSpan = createNewElement(
			"span",
			"class",
			"bullet-content",
			spanContent
		);
		span.append(innerSpan);
		span.addEventListener("click", () => {
			goToSection(section.classList[0]);
		});
		console.log(span);
		bulletContainer.append(span);
	});
};
createNavigationBullets();
/** Open Menu on Small Screens */

toggleMenuIcon.addEventListener("click", () => {
	headerMenu.classList.toggle("open");
});
