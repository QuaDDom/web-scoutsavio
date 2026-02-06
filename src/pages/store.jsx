import React, { useState, useEffect, useMemo } from 'react';
import '../styles/store.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { authService, supabase } from '../lib/supabase';
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaTimes,
  FaCheck,
  FaFilter,
  FaSearch,
  FaWhatsapp,
  FaStore,
  FaTshirt,
  FaTag,
  FaBox,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingBag
} from 'react-icons/fa';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
  Badge,
  Chip,
  Tabs,
  Tab,
  Card,
  CardBody,
  Spinner,
  Image
} from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';

// Categorías de productos
const CATEGORIES = [
  { key: 'all', label: 'Todos', icon: <FaStore /> },
  { key: 'uniforms', label: 'Uniformes', icon: <FaTshirt /> },
  { key: 'accessories', label: 'Accesorios', icon: <FaTag /> },
  { key: 'camping', label: 'Camping', icon: <FaBox /> },
  { key: 'other', label: 'Otros', icon: <FaShoppingBag /> }
];

// Componente de producto individual
const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = React.useRef(null);
  const productImage = product.images?.[0] || product.image_url;

  // Handle cached images that may already be loaded
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalHeight > 0) {
      setImageLoaded(true);
    }
  }, [productImage]);

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}>
      <div className="product-image" onClick={() => onViewDetails(product)}>
        {productImage && !imageError ? (
          <img
            ref={imgRef}
            src={productImage}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        ) : (
          <div className="no-image">
            <FaTshirt />
          </div>
        )}
        {product.discount_percent > 0 && (
          <span className="discount-badge">-{product.discount_percent}%</span>
        )}
        {product.stock <= 0 && <span className="out-of-stock">Agotado</span>}
      </div>

      <div className="product-info">
        <span className="product-category">{getCategoryLabel(product.category)}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.short_description}</p>

        <div className="product-pricing">
          {product.discount_percent > 0 ? (
            <>
              <span className="original-price">${product.price.toLocaleString()}</span>
              <span className="discounted-price">
                $
                {calculateDiscountedPrice(product.price, product.discount_percent).toLocaleString()}
              </span>
            </>
          ) : (
            <span className="price">${product.price.toLocaleString()}</span>
          )}
        </div>

        <Button
          className="add-to-cart-btn"
          onPress={() => onAddToCart(product)}
          isDisabled={product.stock <= 0}
          startContent={<FaShoppingCart />}>
          {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
        </Button>
      </div>
    </motion.div>
  );
};

// Helper functions
const getCategoryLabel = (key) => {
  const cat = CATEGORIES.find((c) => c.key === key);
  return cat ? cat.label : key;
};

const calculateDiscountedPrice = (price, discountPercent) => {
  return Math.round(price * (1 - discountPercent / 100));
};

// Componente del carrito
const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, onCheckout }) => {
  const total = cart.reduce((sum, item) => {
    const price =
      item.discount_percent > 0
        ? calculateDiscountedPrice(item.price, item.discount_percent)
        : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
            <div className="cart-header">
              <h2>
                <FaShoppingCart /> Tu Carrito
              </h2>
              <button className="close-btn" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingBag />
                  <p>Tu carrito está vacío</p>
                  <span>Agregá productos para continuar</span>
                </div>
              ) : (
                cart.map((item) => {
                  const itemImage = item.images?.[0] || item.image_url;
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        {itemImage ? <img src={itemImage} alt={item.name} /> : <FaTshirt />}
                      </div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-price">
                          $
                          {(item.discount_percent > 0
                            ? calculateDiscountedPrice(item.price, item.discount_percent)
                            : item.price
                          ).toLocaleString()}
                        </p>
                        {item.selectedSize && (
                          <span className="item-size">Talle: {item.selectedSize}</span>
                        )}
                      </div>
                      <div className="item-quantity">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <FaMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <FaPlus />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <strong>${total.toLocaleString()}</strong>
                </div>
                <Button
                  className="checkout-btn"
                  onPress={onCheckout}
                  size="lg"
                  startContent={<FaWhatsapp />}>
                  Finalizar pedido por WhatsApp
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Modal de detalles del producto
const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images || [product.image_url].filter(Boolean);
  const sizes = product.sizes || [];

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      quantity
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent className="product-detail-modal">
        {(onCloseModal) => (
          <>
            <ModalBody>
              <div className="product-detail-content">
                <div className="product-gallery">
                  <div className="main-image">
                    {images.length > 0 ? (
                      <img src={images[currentImageIndex]} alt={product.name} />
                    ) : (
                      <div className="no-image">
                        <FaTshirt />
                      </div>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="thumbnail-list">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(idx)}>
                          <img src={img} alt={`${product.name} ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="product-detail-info">
                  <span className="detail-category">{getCategoryLabel(product.category)}</span>
                  <h2>{product.name}</h2>

                  <div className="detail-pricing">
                    {product.discount_percent > 0 ? (
                      <>
                        <span className="original">${product.price.toLocaleString()}</span>
                        <span className="discounted">
                          $
                          {calculateDiscountedPrice(
                            product.price,
                            product.discount_percent
                          ).toLocaleString()}
                        </span>
                        <Chip color="danger" size="sm">
                          -{product.discount_percent}%
                        </Chip>
                      </>
                    ) : (
                      <span className="current">${product.price.toLocaleString()}</span>
                    )}
                  </div>

                  <p className="detail-description">{product.description}</p>

                  {sizes.length > 0 && (
                    <div className="size-selector">
                      <label>Talle:</label>
                      <div className="size-options">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                            onClick={() => setSelectedSize(size)}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="quantity-selector">
                    <label>Cantidad:</label>
                    <div className="quantity-controls">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <FaMinus />
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="stock-info">
                    {product.stock > 0 ? (
                      <span className="in-stock">
                        <FaCheck /> {product.stock} disponibles
                      </span>
                    ) : (
                      <span className="out-of-stock">Sin stock</span>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCloseModal}>
                Cancelar
              </Button>
              <Button
                className="add-btn"
                onPress={handleAddToCart}
                isDisabled={product.stock <= 0 || (sizes.length > 0 && !selectedSize)}
                startContent={<FaShoppingCart />}>
                Agregar al carrito
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// Componente principal de la tienda
export const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [user, setUser] = useState(null);

  // Cargar productos
  useEffect(() => {
    loadProducts();
    loadUser();
    loadCartFromStorage();
  }, []);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('scout-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (newCart) => {
    localStorage.setItem('scout-cart', JSON.stringify(newCart));
  };

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Funciones del carrito
  const addToCart = (product) => {
    const existingItem = cart.find(
      (item) => item.id === product.id && item.selectedSize === product.selectedSize
    );

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id && item.selectedSize === product.selectedSize
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: product.quantity || 1 }];
    }

    setCart(newCart);
    saveCartToStorage(newCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    onDetailOpen();
  };

  const handleCheckout = () => {
    // Generar mensaje para WhatsApp
    const itemsList = cart
      .map((item) => {
        const price =
          item.discount_percent > 0
            ? calculateDiscountedPrice(item.price, item.discount_percent)
            : item.price;
        return `• ${item.name}${item.selectedSize ? ` (Talle: ${item.selectedSize})` : ''} x${item.quantity} - $${(price * item.quantity).toLocaleString()}`;
      })
      .join('\n');

    const total = cart.reduce((sum, item) => {
      const price =
        item.discount_percent > 0
          ? calculateDiscountedPrice(item.price, item.discount_percent)
          : item.price;
      return sum + price * item.quantity;
    }, 0);

    const message = encodeURIComponent(
      `¡Hola! Quiero hacer un pedido de la tienda scout:\n\n${itemsList}\n\n*Total: $${total.toLocaleString()}*\n\nGracias!`
    );

    // Número de WhatsApp del grupo scout (cambiar por el real)
    const phoneNumber = '5493512345678';
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <SEO
        title="Tienda Scout - Grupo Scout 331 Savio"
        description="Comprá uniformes, accesorios y equipamiento scout. Pasapañuelos, remeras, camperas y más."
      />
      <PageContainer>
        <main className="store-page">
          {/* Hero Section */}
          <section className="store-hero">
            <div className="hero-content">
              <motion.div
                className="hero-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}>
                <h1>
                  <FaStore /> Tienda Scout
                </h1>
                <p>
                  Encontrá todo lo que necesitás para tu aventura scout. Uniformes, accesorios,
                  equipamiento y más.
                </p>
              </motion.div>
            </div>

            {/* Cart Button */}
            <button className="cart-floating-btn" onClick={() => setIsCartOpen(true)}>
              <FaShoppingCart />
              {cartItemsCount > 0 && <span className="cart-count">{cartItemsCount}</span>}
            </button>
          </section>

          {/* Filters */}
          <section className="store-filters">
            <div className="filters-container">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="category-tabs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    className={`category-tab ${selectedCategory === cat.key ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.key)}>
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="products-section">
            {loading ? (
              <div className="loading-state">
                <Spinner size="lg" color="warning" />
                <p>Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <FaBox />
                <h3>No hay productos disponibles</h3>
                <p>
                  {searchQuery
                    ? 'No encontramos productos que coincidan con tu búsqueda'
                    : 'Pronto agregaremos nuevos productos'}
                </p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Info Section */}
          <section className="store-info">
            <div className="info-cards">
              <div className="info-card">
                <FaWhatsapp />
                <h3>Pedidos por WhatsApp</h3>
                <p>Agregá productos al carrito y finalizá tu pedido directamente por WhatsApp</p>
              </div>
              <div className="info-card">
                <FaBox />
                <h3>Retiro en el grupo</h3>
                <p>Retirá tus productos en las reuniones del grupo scout</p>
              </div>
              <div className="info-card">
                <FaHeart />
                <h3>Apoyás al grupo</h3>
                <p>Todas las ganancias van directamente a las actividades del grupo</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </PageContainer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        onAddToCart={addToCart}
      />
    </>
  );
};

export default Store;
