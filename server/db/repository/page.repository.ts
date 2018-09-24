import { EntityRepository, getCustomRepository } from "typeorm";
import { BaseCommonRepository } from "../BaseCommonRepository";
import { PageEntity } from "../entity/page.entity";
import { UserEntity } from "../entity/user.entity";
import { pages } from './initfiles/pages';
import { UserRepository } from "./user.repository";

@EntityRepository(PageEntity)
export class PageRepository extends BaseCommonRepository<PageEntity>{

    public _entityIdentifier = "PageEntity";

    public async InitDefaults(): Promise<void> {
        let exist: boolean;
        let newPage: PageEntity = new PageEntity();
        let user: UserEntity = await getCustomRepository(UserRepository).getShortUserById(0);
        newPage.author = user;
        newPage.lastEditor = user;
        newPage.indexInTutorial = -1;
        newPage.isPublic = true;
        for (let p of pages) {
            exist = await this.checkIfPageExists(p.id);
            if (!exist) {
                newPage.id=p.id;
                newPage.title = p.title;
                newPage.content = p.content;
                await this.repository.save(newPage);
            }
        }
    }

    public async getPage(id): Promise<PageEntity> {
        return this.repository.findOne(id, { select: ["id", "title", "content", "updateDate", "indexInTutorial", "isPublic"] });
    }

    public async adminGetPage(id): Promise<PageEntity> {
        return this.repository.findOne(id, { select: ["id", "title", "content", "updateDate", "indexInTutorial", "isPublic"], relations: ["author", "lastEditor"] });
    }

    public async checkIfPageExists(id): Promise<boolean> {
        let tmp: PageEntity = await this.getPage(id);
        return (tmp !== undefined && tmp !== null);
    }

    public async updatePage(page: PageEntity, editor: UserEntity): Promise<PageEntity> {
        let oldPage: PageEntity = await this.getPage(page.id);
        if (oldPage !== undefined && oldPage !== null) {
            oldPage.title = page.title;
            oldPage.content = page.content;
            oldPage.lastEditor = editor;
            if (oldPage.indexInTutorial >= 0 && page.indexInTutorial >= 0) {
                oldPage.indexInTutorial = page.indexInTutorial;
            }
            return this.repository.save(oldPage);
        }
        return;
    }

    public async adminUpdatePage(page: PageEntity, editor: UserEntity): Promise<PageEntity> {
        let exists: boolean = await this.checkIfPageExists(page.id);
        if (!exists) {
            page.author = editor;
            page.id = null;
        }
        page.lastEditor = editor;
        return this.repository.save(page);
    }

    public async createPage(page: PageEntity, editor: UserEntity): Promise<PageEntity> {
        page.lastEditor = editor;
        page.author = editor;
        page.id = null;
        return this.repository.save(page);
    }

    public async getPages(limit: number, page: number): Promise<PageEntity[]> {
        return this.repository.find({ order: { "updateDate": "DESC" }, take: limit, skip: limit * page });
    }

    public async deletePage(id: number) {
        let exist: boolean = await this.checkIfPageExists(id);
        if (exist) {
            let tmp: PageEntity = await this.adminGetPage(id);
            await this.repository.remove(tmp);
        }
        return;
    }
}