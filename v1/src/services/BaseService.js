class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    async findAll(where) {
        return await this.repository.find(where);
    }

    async add(item) {
        return await this.repository.save(item);
    }

    async delete(itemId) {
        return await this.repository.delete(itemId);
    }

    async find(id) {
        return await this.repository.findOne({ where: { id } });
    }

    async update(where, updateInfo) {
        await this.repository.update(where, updateInfo);
        return await this.repository.findOne({ where });
    }
}

export default BaseService;
