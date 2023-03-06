class CodeWarsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.userNames = ["CodeYourFuture", "ali-nasir-ali", "SallyMcGrath"]; // An array of usernames
    this.userData = [];
  }

  connectedCallback() {
    this.fetchDataForAllUsers()
      .then(() => {
        this.render();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async fetchDataForAllUsers() {
    // Create an array of Promises that fetch data for each user
    const promises = this.userNames.map(async (userName) => {
      const response = await fetch(`https://www.codewars.com/api/v1/users/${userName}`);
      const data = await response.json();
      return {
        ...data,
        color: data.ranks.overall.color,
      };
    });
    // Wait for all the Promises to resolve and set the userData property with the fetched data
    this.userData = await Promise.all(promises);
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
        data { 
            border: 3px solid; 
            padding: .25em .5em;
        }      
        ${this.userData
          .map(
            (user) => `
          :host([data-user="${user.username}"]) {
            --rank: ${user.color};
            font: 600 100%/1 system-ui, sans-serif;
          }
          :host([data-user="${user.username}"]) data { 
            color: var(--rank);
          }
          `
          )
          .join("")}
      </style>
      ${this.userData
        .map(
          (user) => `
        <data value="${user.ranks.overall.score}" data-user="${user.username}">
          ${user.name}
        </data>
        <data value="${user.ranks.overall.score}" data-user="${user.username}">
          ${user.ranks.overall.name}
        </data>
        <data value="${user.ranks.overall.score}" data-user="${user.username}">
          ${user.honor}
        </data>
      `
        )
        .join("")}
      `;
  }
}

customElements.define("codewars-badge", CodeWarsBadge);
