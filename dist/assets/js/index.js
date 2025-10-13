import "./modulepreload-polyfill.js";
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const accordions = document.querySelectorAll(".accordion");
    accordions.forEach((accordion) => {
      const header = accordion.querySelector(".accordion__header");
      const arrow = accordion.querySelector(".accordion__arrow");
      if (header) {
        header.addEventListener("click", function(e) {
          if (e.target.type === "checkbox" || e.target.closest(".label-checkbox")) {
            return;
          }
          const isOpen = accordion.classList.contains("is-open");
          accordions.forEach((acc) => {
            acc.classList.remove("is-open");
            const accArrow = acc.querySelector(".accordion__arrow");
            if (accArrow) {
              accArrow.setAttribute("aria-expanded", "false");
            }
          });
          if (!isOpen) {
            accordion.classList.add("is-open");
            if (arrow) {
              arrow.setAttribute("aria-expanded", "true");
            }
          }
        });
      }
    });
    const navList = document.querySelector(".nav__list");
    const closeBtns = document.querySelectorAll(".header__close-btn");
    const toggleBtn = document.querySelector(".panel__toggle");
    const panels = document.querySelectorAll(".viewer-app__panel");
    const contentItems = document.querySelectorAll(".panel--viewer__con__item");
    const resetToggle = () => {
      if (!toggleBtn) return;
      toggleBtn.classList.remove("is-collapsed");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.setAttribute("aria-label", "패널 닫기");
    };
    const updateToggle = () => {
      const active = document.querySelector(".viewer-app__panel.is-active");
      if (!toggleBtn) return;
      toggleBtn.classList.toggle("is-hidden", !active);
      toggleBtn.setAttribute("aria-hidden", String(!active));
    };
    const hidePanels = () => panels.forEach((p) => p.classList.remove("is-active", "is-collapsed"));
    const clearNav = () => document.querySelectorAll(".nav__item--active").forEach((item) => item.classList.remove("nav__item--active"));
    navList == null ? void 0 : navList.addEventListener("click", (e) => {
      var _a;
      const link = e.target.closest(".nav__link");
      if (!link) return;
      e.preventDefault();
      const target = link.dataset.target;
      clearNav();
      link.parentElement.classList.add("nav__item--active");
      link.setAttribute("aria-current", "page");
      hidePanels();
      (_a = document.querySelector(`.viewer-app__panel[data-panel="${target}"]`)) == null ? void 0 : _a.classList.add("is-active");
      resetToggle();
      updateToggle();
    });
    closeBtns.forEach((btn) => btn.addEventListener("click", (e) => {
      e.preventDefault();
      hidePanels();
      clearNav();
      resetToggle();
      updateToggle();
    }));
    toggleBtn == null ? void 0 : toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const active = document.querySelector(".viewer-app__panel.is-active");
      if (!active) return;
      const collapsed = active.classList.toggle("is-collapsed");
      toggleBtn.classList.toggle("is-collapsed", collapsed);
      toggleBtn.setAttribute("aria-expanded", String(!collapsed));
      toggleBtn.setAttribute("aria-label", collapsed ? "패널 열기" : "패널 닫기");
    });
    contentItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        var _a;
        e.preventDefault();
        const target = item.dataset.target;
        if (!target) return;
        clearNav();
        document.querySelectorAll(".nav__link").forEach((link) => {
          if (link.dataset.target === target) {
            link.parentElement.classList.add("nav__item--active");
            link.setAttribute("aria-current", "page");
          }
        });
        hidePanels();
        (_a = document.querySelector(`.viewer-app__panel[data-panel="${target}"]`)) == null ? void 0 : _a.classList.add("is-active");
        resetToggle();
        updateToggle();
      });
    });
    updateToggle();
  });
})();
document.querySelectorAll(".tab-group").forEach((tabGroup) => {
  const tabs = tabGroup.querySelectorAll(".tab-group__tab");
  const panels = Array.from(tabs).map(
    (tab) => document.getElementById(tab.getAttribute("aria-controls"))
  );
  function activateTab(idx, moveToPanelInput = true) {
    tabs.forEach((tab, i) => {
      tab.classList.toggle("tab-group__tab--selected", i === idx);
      tab.setAttribute("aria-selected", i === idx ? "true" : "false");
      tab.tabIndex = i === idx ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== idx;
      if (i === idx && moveToPanelInput) {
        const focusable = panel.querySelector('select, input, textarea, button, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
      }
    });
    tabs[idx].focus();
  }
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => activateTab(idx));
    tab.addEventListener("keydown", (e) => {
      let dir = 0;
      if (e.key === "ArrowRight") dir = 1;
      else if (e.key === "ArrowLeft") dir = -1;
      else if (e.key === "Home") dir = -999;
      else if (e.key === "End") dir = 999;
      else if (e.key === "Enter" || e.key === " ") {
        activateTab(idx, true);
        e.preventDefault();
        return;
      } else {
        return;
      }
      let nextIdx;
      if (dir === -999) nextIdx = 0;
      else if (dir === 999) nextIdx = tabs.length - 1;
      else nextIdx = (idx + dir + tabs.length) % tabs.length;
      activateTab(nextIdx, false);
      e.preventDefault();
    });
  });
  activateTab(0, false);
});
document.querySelectorAll(".observation-card").forEach((card) => {
  const checkBtn = card.querySelector(".observation-card__check-btn");
  const content = card.querySelector(".observation-card__content");
  const radios = card.querySelectorAll(".observation-card__radio");
  let active = false;
  function updateState() {
    if (active) {
      card.classList.add("active");
      checkBtn.setAttribute("aria-pressed", "true");
      radios.forEach((r) => r.disabled = false);
      content.setAttribute("aria-hidden", "false");
    } else {
      card.classList.remove("active");
      checkBtn.setAttribute("aria-pressed", "false");
      radios.forEach((r) => r.disabled = true);
      content.setAttribute("aria-hidden", "true");
    }
  }
  updateState();
  function toggleCardActive() {
    active = !active;
    updateState();
  }
  checkBtn.addEventListener("click", toggleCardActive);
  checkBtn.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleCardActive();
    }
  });
});
const sliders = document.querySelectorAll(".custom-slider");
function setSliderTrackAndValue(el) {
  const min = +el.min;
  const max = +el.max;
  const val = +el.value;
  const percent = (val - min) / (max - min) * 100;
  const grad = `linear-gradient(to right, #444 ${percent}%, #e6e6e6 ${percent}%)`;
  el.style.background = grad;
  const valueSpan = el.parentElement.querySelector(".slider-value");
  if (valueSpan) valueSpan.textContent = val;
}
sliders.forEach((slider) => {
  setSliderTrackAndValue(slider);
  slider.addEventListener("input", () => setSliderTrackAndValue(slider));
});
const input = document.getElementById("fileInput1");
const fileList = document.getElementById("fileList1");
function renderFileList(files) {
  fileList.innerHTML = "";
  Array.from(files).forEach((file, idx) => {
    const li = document.createElement("li");
    li.className = "step-filelist__item";
    const nameSpan = document.createElement("span");
    nameSpan.className = "step-filelist__name";
    nameSpan.textContent = file.name;
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "step-filelist__remove";
    removeBtn.setAttribute("aria-label", `파일 ${file.name} 삭제`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      const dt = new DataTransfer();
      Array.from(input.files).forEach((f, i) => {
        if (i !== idx) dt.items.add(f);
      });
      input.files = dt.files;
      renderFileList(input.files);
    });
    li.appendChild(nameSpan);
    li.appendChild(removeBtn);
    fileList.appendChild(li);
  });
}
input.addEventListener("change", () => {
  renderFileList(input.files);
});
//# sourceMappingURL=index.js.map
