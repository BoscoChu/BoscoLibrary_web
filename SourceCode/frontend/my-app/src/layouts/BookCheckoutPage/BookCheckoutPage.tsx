import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { Loading } from "../Utils/Loading";
import { StarReview } from "../Utils/StarReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import { error } from "console";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();   


    
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);



            //review state
            const [review, setReview] = useState<ReviewModel[]>([]);
            const [totalStars, setTotalStars] = useState(0);
            const [isLoadingReview, setIsLoadingReview] = useState(true);

            const [isReviewLeft, setIsReviewLeft] = useState(false);
            const [isLoadingUserReview, setisLoadingUserReview] = useState(true);





    // Loans Count State
    const [CurrentLoansCount, setCurrentLoanCount] = useState(0);
    const [isLoadingCurrentLoansCount,setIsLoadingCurrentLoansCount] = useState(true);

    //is book checkout?
    const [isCheckOut, setIsCheckOut] = useState(false);
    const [isLoadingBookCheckOut, setLoadingBooksetIsCheckOut] = useState(true);



    const bookId = (window.location.pathname).split('/')[2];       //get the last URL-string: bookId

    useEffect(() => {
        const fetchBook = async () => {  //get all the book
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(baseUrl);  //fetch all the data from spring boot


            if (!response.ok) {           //checking
                throw new Error("Something went Wrong!");
            }

            const responseJson = await response.json(); //response to json
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,

            };  //create the new variable



            setBook(loadedBook);      // set the book  to loadedbook
            setIsLoading(false);              // set the loading to loaded state



        };
        fetchBook().catch((error: any) => {  //if catch error
            setIsLoading(false);
            setHttpError(error.message);

        }
        )





    }, [isCheckOut]);

    useEffect(() => {
    
    const fetchBookReview = async () => {
            const reviewUrl : string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const response = await fetch(reviewUrl);  //fetch all the data from spring boot
            if (!response.ok) {           //checking
                throw new Error("Something went Wrong!");
            }
            const responseJson = await response.json(); //response to json
            const responseData = responseJson._embedded.reviews;  //get the data 
            const loadedReview: ReviewModel[] =[];  //create the new variable

                let wieghtdStarReview: number = 0;
        for(const key in responseData){         //push the data 
                loadedReview.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,     
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,

    
                });
                wieghtdStarReview+=responseData[key].rating;


                                    }

        if(loadedReview){
            const round = (Math.round((wieghtdStarReview/loadedReview.length)*2)/2).toFixed(1);
            setTotalStars(Number(round));


        }
                setReview(loadedReview);
                setIsLoadingReview(false);

    };
    fetchBookReview().catch((error: any) => {  //if catch error
        setIsLoading(false);
        setHttpError(error.message);

    }
    )

    },[isReviewLeft]);

    useEffect(() => {
    
        const fetchUserReviewBook = async () => {
            if(authState && authState.isAuthenticated){
                const url : string = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`;
                const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                        const userReview = await fetch(url, requestOptions);
                        if(!userReview.ok){
                            throw new Error("Something went Wrong!");
                            }
                            const userReviewResponseJson = await userReview.json();
                            setIsReviewLeft(userReviewResponseJson);
                        }
                        setisLoadingUserReview(false);
                    }
        fetchUserReviewBook().catch((error:any)=>{
            setisLoadingUserReview(false);
            setHttpError(error.message);
    
        })
    
        },[authState]);
    


    useEffect(() =>{

        const fetchUserCurrentLoansCount = async () =>{
            if(authState && authState.isAuthenticated){
                const url0 : string = `http://localhost:8080/api/books/secure/currentloans/count`;
                const requestOptions0 = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }


                };
                const CurrentLoansCountResponse = await fetch(url0, requestOptions0);
                if(!CurrentLoansCountResponse.ok){
                    throw new Error("Something went Wrong!");

                }
                const CurrentLoansCountResponseJson = await CurrentLoansCountResponse.json();
                setCurrentLoanCount(CurrentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
            
        }
        fetchUserCurrentLoansCount().catch((error: any) => {  //if catch error
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })


}, [authState,isCheckOut]);

       



useEffect(() =>{

    const fetchUserCheckOutBook = async () =>{  
        if(authState && authState.isAuthenticated){
            const url1 : string = `http://localhost:8080/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
            const requestOptions1 = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }


            };
            const bookCheckedOut = await fetch(url1, requestOptions1);
            if(!bookCheckedOut.ok){
                throw new Error("Something went Wrong!");

            }
            const bookCheckedOutJson = await bookCheckedOut.json();
            setIsCheckOut(bookCheckedOutJson);
        }
        setLoadingBooksetIsCheckOut(false);


    }
    fetchUserCheckOutBook().catch((error:any) =>{
        setLoadingBooksetIsCheckOut(false);
        setHttpError(error.message);


    }
    )



    },[authState])







    if (isLoading || isLoadingReview|| isLoadingCurrentLoansCount|| isLoadingBookCheckOut || isLoadingUserReview) {
        return (

            <Loading />

        )

    }

    if (httpError) {
        return (

            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )

    }


async function checkoutBook() {
    const url : string = `http://localhost:8080/api/books/secure/checkout?bookId=${bookId}`;
    const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }   


    };
    const checkedOutResponse = await fetch(url, requestOptions);
    if(!checkedOutResponse.ok){
        throw new Error("Something went Wrong!");

    }
    setIsCheckOut(true);
}

        async function submitReview(starInput: number, reviewDescription: string) {
                let bookId: number = 0;
                if(book?.id){
                        bookId = book.id;
                }
                const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
                const url = `http://localhost:8080/api/reviews/secure/`;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reviewRequestModel)
                };
                const returnResponse = await fetch(url, requestOptions); //call the api
                     if(!returnResponse.ok){
                     throw new Error("Something went Wrong!");

    }
                     setIsReviewLeft(true);
}



    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} width={226} height={349} alt="Book" />
                            :
                            <img
                                src={require('./../../Images/BooksImages/book-luv2code-1000.png')}          // else,  show the default images
                                width='226'
                                height='349'
                                alt="Book" />


                        }
                    </div>


                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarReview Rating={totalStars} size={32} />

                            <div />
                            <div />
                            





                        </div>
                        </div>
                        <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={CurrentLoansCount} isAuthenticated={authState?.isAuthenticated} 
                            isCheckedOut={isCheckOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                         </div>

                        <hr />
                            <LatestReviews reviews={review} bookId={book?.id} mobile={false}/>



                 </div>
                    <div className="container d-lg-none mt-5">
                        <div className="d-flex justify-content-center alighn-items-center">
                            {book?.img ?
                                <img src={book?.img} width={226} height={349} alt="Book" />
                                :
                                <img
                                    src={require('./../../Images/BooksImages/book-luv2code-1000.png')}          // else,  show the default images
                                    width='226'
                                    height='349'
                                    alt="Book" />


                            }

                        </div>
                    <div className="mt-4">
                            <div className="ml-2">
                                <h2>{book?.title}</h2>
                                <h5 className="text-primary">{book?.author}</h5>
                                <p className="lead">{book?.description}</p>
                                <StarReview Rating={totalStars} size={32} />
                            </div>

                     </div>
                     <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={CurrentLoansCount} isAuthenticated={authState?.isAuthenticated} 
                     isCheckedOut={isCheckOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>

                        <hr />
                        <LatestReviews reviews={review} bookId={book?.id} mobile={true}/>

             </div>

         </div>


                );


}
