import axios from 'axios';
import Conf from 'conf';

const config = new Conf({ projectName: 'ktmcp-notion' });

export class NotionAPI {
  constructor() {
    this.baseURL = config.get('baseURL') || process.env.NOTION_BASE_URL || 'https://api.notion.com/v1';
    this.apiToken = config.get('apiToken') || process.env.NOTION_API_TOKEN;
    this.notionVersion = '2022-06-28'; // Latest Notion API version
  }

  getHeaders() {
    if (!this.apiToken) {
      throw new Error('API token not configured. Run: notion config set apiToken YOUR_TOKEN');
    }
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Notion-Version': this.notionVersion,
      'Content-Type': 'application/json'
    };
  }

  async request(method, endpoint, data = null, params = null) {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: this.getHeaders(),
        data,
        params
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Notion API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  // Pages
  async getPage(pageId) {
    return this.request('GET', `/pages/${pageId}`);
  }

  async createPage(pageData) {
    return this.request('POST', '/pages', pageData);
  }

  async updatePage(pageId, pageData) {
    return this.request('PATCH', `/pages/${pageId}`, pageData);
  }

  async archivePage(pageId) {
    return this.updatePage(pageId, { archived: true });
  }

  // Databases
  async getDatabase(databaseId) {
    return this.request('GET', `/databases/${databaseId}`);
  }

  async queryDatabase(databaseId, query = {}) {
    return this.request('POST', `/databases/${databaseId}/query`, query);
  }

  async createDatabase(databaseData) {
    return this.request('POST', '/databases', databaseData);
  }

  async updateDatabase(databaseId, databaseData) {
    return this.request('PATCH', `/databases/${databaseId}`, databaseData);
  }

  // Blocks
  async getBlock(blockId) {
    return this.request('GET', `/blocks/${blockId}`);
  }

  async getBlockChildren(blockId, params = {}) {
    return this.request('GET', `/blocks/${blockId}/children`, null, params);
  }

  async appendBlockChildren(blockId, blocks) {
    return this.request('PATCH', `/blocks/${blockId}/children`, { children: blocks });
  }

  async deleteBlock(blockId) {
    return this.request('DELETE', `/blocks/${blockId}`);
  }

  // Search
  async search(query = '', filter = {}) {
    return this.request('POST', '/search', {
      query,
      filter,
      sort: { direction: 'descending', timestamp: 'last_edited_time' }
    });
  }

  // Users
  async listUsers(params = {}) {
    return this.request('GET', '/users', null, params);
  }

  async getUser(userId) {
    return this.request('GET', `/users/${userId}`);
  }
}

export const api = new NotionAPI();
