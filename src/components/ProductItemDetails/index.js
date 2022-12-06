import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    apiStatus: apiStatusConstants.initial,
    productQuantity: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    const updatedKeys = productDetails => ({
      id: productDetails.id,
      imageUrl: productDetails.image_url,
      title: productDetails.title,
      price: productDetails.price,
      description: productDetails.description,
      brand: productDetails.brand,
      totalReviews: productDetails.total_reviews,
      rating: productDetails.rating,
      availability: productDetails.availability,
      similarProducts: productDetails.similar_products,
    })

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData1 = updatedKeys(fetchedData)
      const updatedData2 = {
        ...updatedData1,
        similarProducts: updatedData1.similarProducts.map(eachItem =>
          updatedKeys(eachItem),
        ),
      }

      this.setState({
        productDetails: updatedData2,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div
      className="loader-container"
      // testid="loader"
    >
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickDecrement = () => {
    const {productQuantity} = this.state
    if (productQuantity > 1) {
      this.setState({productQuantity: productQuantity - 1})
    }
  }

  onClickIncrement = () => {
    const {productQuantity} = this.state
    this.setState({productQuantity: productQuantity + 1})
  }

  renderProductDetailsView = () => {
    const {productDetails, productQuantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails

    return (
      <div className="pid-section-container">
        <div className="pid-container">
          <img className="pid-image" alt="product" src={imageUrl} />
          <div className="pid-body">
            <h1 className="pid-heading">{title}</h1>
            <p className="pid-price">Rs {price}/- </p>
            <div className="pid-rating-review-container">
              <div className="pid-rating-container">
                <p className="pid-rating-value">{rating}</p>
                <img
                  className="pid-rating-star"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <p className="pid-reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="pid-description">{description}</p>

            <div className="pid-row">
              <p className="pid-title">Available</p>
              <p className="pid-value">{availability}</p>
            </div>
            <div className="pid-row">
              <p className="pid-title">Brand</p>
              <p className="pid-value">{brand}</p>
            </div>
            <hr className="pid-horizontal-line" />
            <div className="pid-count-container" testid="loader">
              <button
                className="pid-count-button"
                onClick={this.onClickDecrement}
                type="button"
                testid="minus"
              >
                <BsDashSquare className="button-icon" />
              </button>
              <p className="pid-count">{productQuantity}</p>
              <button
                className="pid-count-button"
                type="button"
                onClick={this.onClickIncrement}
                testid="plus"
              >
                <BsPlusSquare className="button-icon" />
              </button>
            </div>
            <button className="pid-add-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProductsSection()}
      </div>
    )
  }

  renderSimilarProductsSection = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails

    return (
      <>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProducts.map(eachItem => (
            <SimilarProductItem key={eachItem.id} productDetails={eachItem} />
          ))}
        </ul>
      </>
    )
  }

  redirectProductsRoute = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1 className="failure-message">Product Not Found</h1>
      <button
        className="continue-button"
        type="button"
        onClick={this.redirectProductsRoute}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductItemDetailsBody = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductItemDetailsBody()}
      </>
    )
  }
}
export default ProductItemDetails
