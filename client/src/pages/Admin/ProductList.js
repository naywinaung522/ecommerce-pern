import React from 'react';
import './ProductList.css'; // Add this line

function ProductList({ products, onEdit, onDelete }) {
  // Add search functionality
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Stock status helper
  const getStockStatus = (quantity) => {
    if (quantity <= 5) return 'stock-low';
    if (quantity <= 20) return 'stock-medium';
    return 'stock-high';
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h3>Total Products: {products.length}</h3>
        <div className="product-list-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(product => (
                  <tr key={product.id}>
                    <td className="product-image-cell">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                    </td>
                    <td>{product.id}</td>
                    <td className="product-name">{product.name}</td>
                    <td className="product-price">${product.price}</td>
                    <td>
                      <span className="product-category">{product.category}</span>
                    </td>
                    <td>
                      <span className={`product-stock ${getStockStatus(product.stock_quantity)}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => onEdit(product)}
                          className="action-btn edit-btn"
                          title="Edit product"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDelete(product.id)}
                          className="action-btn delete-btn"
                          title="Delete product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;