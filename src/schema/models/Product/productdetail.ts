interface IColor {
    _id?: string;
    color: string;
}

const Color = {
    color: String,
};

interface ISize {
    _id?: string;
    size: string;
}

const Size = {
    size: String,
};

interface ICategory {
    _id?: string;
    category: string;
}

const Category = {
    category: String,
};

export { IColor, Color, ISize, Size, ICategory, Category };
