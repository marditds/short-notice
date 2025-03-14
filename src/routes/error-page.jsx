import { Link, useRouteError } from "react-router-dom";
import { Container, Image } from "react-bootstrap";
import sn_long from '../assets/sn_long.png';

export default function ErrorPage() {
    const error = useRouteError();
    // console.error(error);

    return (
        <>
            <Container>
                <div className="my-5 d-flex justify-content-center">
                    <Image src={sn_long} fluid />
                </div>

                <div id="error-page" className="mt-5">
                    {/* <p>
                        <i>{error.statusText || error.message}</i>
                    </p> */}
                    <p>
                        Sorry. It seems like things broke along the way. 😫
                    </p>
                    <Link to='/'>Back to ShortNotice</Link>
                </div>
            </Container>
        </>
    );
}