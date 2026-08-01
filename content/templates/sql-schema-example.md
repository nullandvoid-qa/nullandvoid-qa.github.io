# Exemplo: Schema SQL para um Carrinho Simples

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL
);

CREATE TABLE carts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL REFERENCES carts(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1
);
```

Mermaid ER diagram (se seu gerador suporta mermaid):

```mermaid
erDiagram
    PRODUCTS ||--o{ CART_ITEMS : contains
    CARTS ||--o{ CART_ITEMS : has
    PRODUCTS {
      integer id PK
      string name
      number price
    }
    CARTS {
      integer id PK
      integer user_id
      datetime created_at
    }
    CART_ITEMS {
      integer id PK
      integer cart_id FK
      integer product_id FK
      integer quantity
    }
```

Use este esquema para exercícios de verificação de dados, consultas SQL para QA e para simular cenários de integração.