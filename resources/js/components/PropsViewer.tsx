const PropsViewer = ({ props }: any) => {
    return (
        <>
            {Object.keys({ ...props }).map((key) => (
                <div>
                    <span className="font-bold">{key}</span>
                    {' ->'} {JSON.stringify(props[key] ? props[key] : key)}
                </div>
            ))}
        </>
    );
};

export default PropsViewer;
