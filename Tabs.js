class Tabs{
    constructor(
        title,
        url,
        date,
        comment,
    )
    {
        this.title = title;
        this.url = url;
        this.date = date;
        this.comment = comment;
    }

    getTitle(){
        return this.title;
    }

    getURL(){
        return this.url;
    }

    getDate(){
        return this.date;
    }

    getComment(){
        return this.comment;
    }
}

export default Tabs