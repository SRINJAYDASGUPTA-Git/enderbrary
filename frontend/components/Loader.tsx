import {HashLoader} from "react-spinners";

const Loader = ({subtitle}:{subtitle:string}) => {
    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <HashLoader color={'#b35aff'} />
            <h1 className="text-2xl font-bold mt-4">Loading</h1>
            <p className="text-gray-500">{subtitle}</p>
        </div>

    );
};

export default Loader;