class EntityNotFoundException extends Error {
  constructor(id: string) {
    super(`Entity with id ${id} not found`);
  }
}
export default EntityNotFoundException;
