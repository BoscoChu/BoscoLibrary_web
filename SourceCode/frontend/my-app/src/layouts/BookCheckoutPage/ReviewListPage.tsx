import { useEffect, useState } from "react";
import ReviewModel from "../../models/ReviewModel";
import { Loading } from "../Utils/Loading";
import { Review } from "../Utils/Review";
import { Pagination } from "../Utils/Pagination";

export const ReviewListPage = () =>{

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Pagination
     const [currentPage, setCurrentPage] = useState(1);
    const [reviewPerPage] = useState(5);
    const [totalAmountOfReview, setTotalAmountOfReview] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const bookId = (window.location.pathname).split('/')[2];       //get the last URL-string: bookId


    useEffect(() => {
    
        const fetchBookReview = async () => {
                const reviewUrl : string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage -1}&size=${reviewPerPage}`;
                const response = await fetch(reviewUrl);  //fetch all the data from spring boot
                if (!response.ok) {           //checking
                    throw new Error("Something went Wrong!");
                }
                const responseJson = await response.json(); //response to json
                const responseData = responseJson._embedded.reviews;  //get the data 

                setTotalAmountOfReview(responseJson.page.totalElements);

                setTotalPage(responseJson.page.totalPage);

                const loadedReview: ReviewModel[] =[];  //create the new variable
    


            for(const key in responseData){         //push the data 
                    loadedReview.push({
                        id: responseData[key].id,
                        userEmail: responseData[key].userEmail,     
                        date: responseData[key].date,
                        rating: responseData[key].rating,
                        book_id: responseData[key].bookId,
                        reviewDescription: responseData[key].reviewDescription,
    
        
                    });    
    
                   }
    

                    setReviews(loadedReview);
                    setIsLoading(false);
    
        };
        fetchBookReview().catch((error: any) => {  //if catch error
            setIsLoading(false);
            setHttpError(error.message);
    
        }
        )
    
        },[currentPage]);

        if(isLoading){
            return(<Loading/>);
        }
          
        if(httpError){
            return(
                <div className="container m-5"><p>{httpError}</p></div>


            );
        }

        const indexOfLastReview: number = currentPage * reviewPerPage
        const indexOfFirstReview: number = indexOfLastReview - reviewPerPage

        let lastItem = reviewPerPage * currentPage <= totalAmountOfReview ? reviewPerPage * currentPage : totalAmountOfReview;  

        const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


return (
    <div className="container m-5">
        <div>
            <h3>Comments: ({reviews.length})</h3>
        </div>
             <p>
            {indexOfFirstReview +1} to {lastItem} of {indexOfLastReview}items
            </p>
        <div className="row">
           {reviews.map(reviews => (<Review review={reviews} key={reviews.book_id}/>) )} 
        </div>
        {totalPage >1 && <Pagination currentPage={currentPage} totalPages={totalPage} paginate={paginate}/>}
    </div>



);

}