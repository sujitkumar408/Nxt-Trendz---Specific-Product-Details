import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, price, brand, rating} = productDetails

  return (
    <li className="sp-card">
      <img
        className="sp-image"
        alt={`similar product ${title}`}
        src={imageUrl}
      />
      <h1 className="sp-title">{title}</h1>
      <p className="sp-brand">by {brand}</p>
      <div className="sp-price-rating-container">
        <p className="sp-price">Rs {price}/- </p>
        <div className="sp-rating-container">
          <p className="sp-rating-value">{rating}</p>
          <img
            className="sp-rating-star"
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
