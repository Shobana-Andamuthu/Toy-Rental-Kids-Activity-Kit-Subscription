const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/User/Downloads/toy-rental-navbar-redesign';
const files = [
  'plans.html',
  'how-it-works.html',
  'hygiene.html',
  'faq.html',
  'product-details.html'
];

files.forEach(f => {
  const filePath = path.join(dir, f);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the desktop navbar nav section
  const oldNavRegex = /<ul class="navbar-nav">[\s\S]*?<\/ul>\s*<\/div>\s*<div class="nav-actions d-none d-lg-flex">[\s\S]*?<a href="login.html" class="btn btn-sm btn-nav-login">Login<\/a>\s*<\/div>/;

  // Determine active item based on filename
  let isHome1 = false, isHome2 = false, isAbout = false, isCatalog = false, isPlans = false, isHow = false, isHygiene = false, isFaq = false, isContact = false;
  if (f === 'plans.html') isPlans = true;
  if (f === 'how-it-works.html') isHow = true;
  if (f === 'hygiene.html') isHygiene = true;
  if (f === 'faq.html') isFaq = true;
  if (f === 'product-details.html') isCatalog = true;

  const newNav = `<ul class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle${isHome1 || isHome2 ? ' active' : ''}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Home <i class="bi bi-chevron-down nav-caret"></i>
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item${isHome1 ? ' active' : ''}" href="index.html">Home 1</a></li>
                  <li><a class="dropdown-item${isHome2 ? ' active' : ''}" href="home-2.html">Home 2</a></li>
                </ul>
              </li>
              <li class="nav-item"><a class="nav-link${isAbout ? ' active' : ''}" href="about.html">About</a></li>
              <li class="nav-item"><a class="nav-link${isCatalog ? ' active' : ''}" href="catalog.html">Catalog</a></li>
              <li class="nav-item"><a class="nav-link${isPlans ? ' active' : ''}" href="plans.html">Plans</a></li>
              <li class="nav-item"><a class="nav-link${isHow ? ' active' : ''}" href="how-it-works.html">How It Works</a></li>
              <li class="nav-item"><a class="nav-link${isHygiene ? ' active' : ''}" href="hygiene.html">Hygiene</a></li>
              <li class="nav-item"><a class="nav-link${isContact ? ' active' : ''}" href="contact.html">Contact</a></li>
              <li class="nav-item"><a class="nav-link" href="dashboard/index.html">Dashboard</a></li>
            </ul>
          </div>

          <div class="nav-actions d-none d-lg-flex">
            <button class="nav-icon-btn" type="button" data-theme-toggle aria-label="Switch to dark mode" title="Switch theme"><i class="bi bi-moon-stars-fill"></i></button>
            <button class="nav-toggle-btn" type="button" data-direction-toggle aria-label="Switch to RTL" title="Switch direction"><span>LTR</span></button>
            <a href="login.html" class="btn btn-sm btn-nav-login">Login</a>
          </div>`;

  if (oldNavRegex.test(content)) {
    content = content.replace(oldNavRegex, newNav);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navbar in ${f}`);
  } else {
    console.log(`Regex did NOT match in ${f}`);
  }
});
