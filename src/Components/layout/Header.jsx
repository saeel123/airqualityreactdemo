const Header = (props) => {
  return (
    <>
      <header>
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="#">
            <img src="./images/logo.png" alt="" />
          </a>
          <button
            class="navbar-toggler collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div id="nav-icon2">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav navbar-nav ml-auto" id="pills-tab" role="tablist">
              <li class="nav-item">
                <a
                  class="nav-link active"
                  id="pills-recent-tab"
                  data-toggle="pill"
                  role="tab"
                  aria-controls="pills-recent"
                  aria-selected="true"
                >
                  Recent
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  id="pills-archive-tab"
                  data-toggle="pill"
                  role="tab"
                  aria-controls="pills-archive"
                  aria-selected="false"
                >
                  Archive
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  id="pills-forecast-tab"
                  data-toggle="pill"
                  role="tab"
                  aria-controls="pills-forecast"
                  aria-selected="false"
                >
                  Forecast
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  id="pills-emission-tab"
                  data-toggle="pill"
                  role="tab"
                  aria-controls="pills-emission"
                  aria-selected="false"
                >
                  Emission
                </a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Language
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="#">
                    English
                  </a>
                  <a class="dropdown-item" href="#">
                    Nepali
                  </a>
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  About
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
