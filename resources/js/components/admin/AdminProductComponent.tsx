type AdminProductComponentProps = {
    product: {
        id: number;
        category_id: number;
        name: string;
        price: number;
        description: string;
        image_url?: string;
    };
};
const AdminProductComponent = (props: AdminProductComponentProps) => {
    return (
        <div className="rounded-xl bg-secondary">
            <img src={props.product.image_url} alt={props.product.name} className="w-full object-cover rounded-t-xl" />
            <div className="p-2">
                <h3 className="text-lg font-semibold line-clamp-1">{props.product.name}</h3>
                <p className="text-sm line-clamp-2">{props.product.description}</p>
                <p className="text-sm">Price: Rs.{props.product.price}</p>
                <div className="flex">
                    <button className="mt-2 hover:cursor-pointer flex-1 rounded bg-primary px-4 py-2 text-white hover:bg-foreground">
                        Edit
                    </button>
                    <button className="mt-2 hover:cursor-pointer ml-2 flex-1 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductComponent;
