export default class MapService {
  static baseUrl = '/api/maps';
  static getAll = () => axios.get(this.baseUrl).then(response => response.data);
  static createMap = (map) => axios.post(this.baseUrl, map).then(response => response.data);
}