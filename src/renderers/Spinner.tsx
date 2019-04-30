import Spinner from "../components/Spinner";
import { Renderer } from "../factory";


@Renderer({
    test: /(^|\/)spinner$/,
    name: 'spinner'
})
export class SpinnerRenderer extends Spinner {}