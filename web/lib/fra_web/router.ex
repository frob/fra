defmodule FraWeb.Router do
  use FraWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", FraWeb do
    pipe_through :browser # Use the default browser stack

    get "/404.html", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", FraWeb do
  #   pipe_through :api
  # end
end
