import { EntityRepository, Like, getCustomRepository } from "typeorm";
import { BaseCommonRepository } from "../BaseCommonRepository";
import { TutorialEntity } from "../entity/tutorial.entity";
import { UserEntity } from "../entity/user.entity";
import { PageEntity } from "../entity/page.entity";
import { PageRepository } from "./page.repository";

@EntityRepository(TutorialEntity)
export class TutorialRepository extends BaseCommonRepository<TutorialEntity>{

    public _entityIdentifier = "TutorialEntity";

    public async InitDefaults(): Promise<void> {
        return;
    }

    public async getTutorials(limit: number, page: number): Promise<TutorialEntity[]> {
        return this.repository.find({ where: { isPublic: true }, order: { "title": "ASC" }, take: limit, skip: limit * page });
    }

    public async adminGetTutorials(limit: number, page: number): Promise<TutorialEntity[]> {
        return this.repository.find({ order: { "updateDate": "DESC" }, take: limit, skip: limit * page });
    }

    public async checkIfTutorialExists(id: string): Promise<boolean> {
        let tutorial: TutorialEntity = await this.repository.findOne(id);
        return (tutorial !== undefined && tutorial !== null);
    }

    public async getTutorial(id: string): Promise<TutorialEntity> {
        return this.repository.findOne(id);
    }

    public async adminGetTutorial(id: string): Promise<TutorialEntity> {
        return this.repository.findOne(id, { relations: ["author", "lastEditor"] });
    }

    public async createTutorial(title: string, author: UserEntity): Promise<TutorialEntity> {
        let id: string = await this.generateId(title);
        let tutorial: TutorialEntity = new TutorialEntity();
        tutorial.id = id;
        tutorial.title = title;
        tutorial.author = author;
        tutorial.lastEditor = author;
        tutorial.isPublic = false;
        return this.repository.save(tutorial);
    }

    public async updateTutorial(tutorial: TutorialEntity, editor: UserEntity): Promise<TutorialEntity> {
        let exists: boolean = await this.checkIfTutorialExists(tutorial.id);
        if (exists) {
            let oldTutorial: TutorialEntity = await this.getTutorial(tutorial.id);
            oldTutorial.title = tutorial.title;
            oldTutorial.lastEditor = editor;
            return this.repository.save(oldTutorial);
        }
        return;
    }

    public async adminUpdateTutorial(tutorial: TutorialEntity, editor: UserEntity): Promise<TutorialEntity> {
        let exists: boolean = await this.checkIfTutorialExists(tutorial.id);
        if (exists) {
            let oldTutorial: TutorialEntity = await this.updateTutorial(tutorial, editor);
            if (tutorial.isPublic !== oldTutorial.isPublic) {
                oldTutorial.isPublic = tutorial.isPublic;
                await this.updatePagesStatus(tutorial.id, tutorial.isPublic);
                return this.repository.save(oldTutorial);
            }
            return oldTutorial;
        }
        return;
    }

    private async updatePagesStatus(id: string, status: boolean): Promise<void> {
        let tutorial: TutorialEntity = await this.repository.findOne(id);
        for (let p of tutorial.pages) {
            p.isPublic = status;
        }
        await this.repository.save(tutorial);
        return;
    }

    public async addPage(id: string, page: PageEntity): Promise<TutorialEntity> {
        let exists: boolean = await this.checkIfTutorialExists(id);
        if (exists) {
            let tutorial: TutorialEntity = await this.repository.findOne(id);
            if (!tutorial.pages) tutorial.pages = [];
            tutorial.pages.push(page);
            console.log(tutorial);
            tutorial.pages = this.assignPageIndex(tutorial.pages);
            console.log(tutorial);
            return this.repository.save(tutorial);
        } else {
            return;
        }
    }

    public async removePage(id: string, pageId: number): Promise<TutorialEntity> {
        let exists: boolean = await this.checkIfTutorialExists(id);
        if (exists) {
            let tutorial: TutorialEntity = await this.repository.findOne(id);
            tutorial.pages = tutorial.pages.filter(p => p.id !== pageId);
            tutorial.pages = this.sortPages(tutorial.pages);
            tutorial.pages = this.assignPageIndex(tutorial.pages);
            await getCustomRepository(PageRepository).deletePage(pageId);
            return this.repository.save(tutorial);
        } else {
            return;
        }
    }

    public async movePage(id: string, pageId: number, delta: number): Promise<TutorialEntity> {
        let exists: boolean = await this.checkIfTutorialExists(id);
        if (exists) {
            let tutorial: TutorialEntity = await this.repository.findOne(id);
            tutorial.pages = this.sortPages(tutorial.pages);
            tutorial.pages = this.assignPageIndex(tutorial.pages);
            let pageIndex = tutorial.pages.find(p => p.id === pageId).indexInTutorial;
            tutorial.pages = this.moveElement(tutorial.pages, pageIndex, delta);
            return this.repository.save(tutorial);
        } else {
            return;
        }
    }

    private moveElement(arr: PageEntity[], index: number, delta: number): PageEntity[] {
        console.log("move page started, delta: " + delta);
        console.log("current index: " + index);
        console.log("current page title: " + arr[index].title);
        let newIndex: number = index + delta;
        console.log("newIndex is " + newIndex);
        if (newIndex < 0) {
            console.log("in if");
            newIndex = 0;
            delta = newIndex - index;
        } else if (newIndex >= arr.length) {
            console.log("in if");
            newIndex = arr.length - 1;
            delta = newIndex - index;
        }

        arr[index].indexInTutorial = newIndex;
        console.log(arr);

        if (delta < 0) {
            for (let i = newIndex; i < index; i++) {
                arr[i].indexInTutorial++;
            }
        } else if (delta > 0) {
            console.log("delta > 0");
            for (let i = index + 1; i <= newIndex; i++) {
                arr[i].indexInTutorial--;
            }
        }
        console.log(arr);
        return this.sortPages(arr);
    }

    private sortPages(pages: PageEntity[]): PageEntity[] {
        if (pages && pages.length > 0)
            pages = pages.sort((a, b) => {
                if (a.indexInTutorial > b.indexInTutorial) return 1;
                else if (a.indexInTutorial < b.indexInTutorial) return -1;
                else return 0;
            });
        else pages = [];
        return pages;
    }

    private assignPageIndex(pages: PageEntity[]): PageEntity[] {
        for (let i = 0; i < pages.length; i++) {
            pages[i].indexInTutorial = i;
        }
        return pages;
    }
    /**
    * Generates an id for a new article.
    * If the candidate id already exists, adds an index after the id.
    * 
    * @param title 
    */
    private async generateId(title: string): Promise<string> {
        let id: string = this.generateTutorialId(title);
        let exists: boolean;
        do {
            exists = await this.checkIfTutorialExists(id);
            if (!exists) {
                return id;
            } else {
                let count: number = await this.countTutorialIdsLike(id);
                id += count + 1;
            }
        } while (exists);
    }

    /**
     * Cleans the title to generate a candidate id.
     * 
     * @param title 
     */
    private generateTutorialId(title: string): string {
        let id: string = title;

        //replace spaces with -
        id = id.split(' ').join('-');
        id = id.toLowerCase();

        id = id.replace(/([à])/g, "a");
        id = id.replace(/([èé])/g, "e");
        id = id.replace(/([ì])/g, "i");
        id = id.replace(/([ò])/g, "o");
        id = id.replace(/([ù])/g, "u");
        id = id.replace(/([ç])/g, "c");

        //replace all chars that are not a-z, 0-9 or '-'
        id = id.replace(/([^a-z0-9-])/g, "");

        id = id.replace(/(-)+/g, "-");

        //if the id starts or ends with one or more '-' remove them
        while (id.startsWith("-")) {
            id = id.substr(1);
        }
        while (id.endsWith("-")) {
            id = id.substr(0, id.length - 1);
        }

        // every tutorial must have an id and "admin","list" and "new" are forbidden tutorial ids
        if (id === "" || id === "admin" || id === "list" || id === "new" || id === "categories") id = "tutorial";
        return id;
    }

    /**
     * Counts the number of ids that are like the candidate one.
     * 
     * @param id 
     */
    private async countTutorialIdsLike(id: string): Promise<number> {
        return this.repository.count({ id: Like(id + "%") });
    }


    public async deleteTutorial(id: string): Promise<void> {
        let exists: boolean = await this.checkIfTutorialExists(id);
        if (exists) {
            let tutorial: TutorialEntity = await this.repository.findOne(id);
            tutorial.pages = [];
            tutorial = await this.repository.save(tutorial);
            await this.repository.remove(tutorial);
            return;
        }
        return;
    }

    public async pageIsInTutorial(tutorialId: string, pageId: number): Promise<boolean> {
        let exists: boolean = await this.checkIfTutorialExists(tutorialId);
        if (exists) {
            let tutorial: TutorialEntity = await this.repository.findOne(tutorialId);
            let index: number = tutorial.pages.findIndex(p => p.id === pageId);
            return index >= 0;
        }
        return false;
    }


}