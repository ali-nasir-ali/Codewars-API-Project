class CodeWarsBadg extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.userNames = ["SallyMcGrath", "CodeYourFuture", "ali-nasir-ali", "hussein-alsayed", "AppolinFotso"]; // An array of usernames
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
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        ${this.userData
          .map(
            (user) => `
            :host([data-user="${user.username}"]) {
              --rank: ${user.color};
              font: 600 100%/1 system-ui, sans-serif;
            }
            :host([data-user="${user.username}"]) td.rank { 
              color: var(--rank);
              font-weight: bold;
            }
            `
          )
          .join("")}
      </style>
      <table>
        <tr>
          <th>Name</th>
          <th>Rank</th>
          <th>Honor</th>
        </tr>
        ${this.userData
          .map(
            (user) => `
            <tr data-user="${user.username}">
              <td>${user.name}</td>
              <td class="rank">${user.ranks.overall.name}</td>
              <td>${user.honor}</td>
            </tr>
          `
          )
          .join("")}
      </table>
    `;
  }
}

customElements.define("codewars-badg", CodeWarsBadg);
