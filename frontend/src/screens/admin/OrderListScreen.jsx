import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/orderApiSlice";
import Meta from "../../components/Meta";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const OrderListScreen = () => {
  const { pageNumber } = useParams();
  const { data, error, isLoading } = useGetOrdersQuery({ pageNumber });

  if (isLoading) {
    return <Loader />;
  } else {
    // Sort orders by createdAt date in descending order (most recent first)

    return (
      <>
        <Meta title="Admin-Órdenes" />
        <h1>Órdenes</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USUARIO</th>
                  <th>FECHA</th>
                  <th>TOTAL</th>
                  <th>PAGADO</th>
                  <th>ENTREGADO</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light" className="btn-sm">
                          Detalles
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Paginate
              pages={data.pages}
              page={data.page}
              screen="admin/orderlist"
            />
          </>
        )}
      </>
    );
  }
};

export default OrderListScreen;
