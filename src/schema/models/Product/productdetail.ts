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

export { IColor, Color, ISize, Size };
