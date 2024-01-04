import React from "react";
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import TarjetaPalabra from "./tarjeta-palabra.jsx";
import App from '../App.jsx';
import { Selector, fixture } from 'testcafe';


const palabra = {
  id_palabra: 1,
  sansckrit: 'Tadasana',
  spanish: 'Postura de la Montaña',
  english: 'Mountain Pose',
  diccionaryWordModels: [
    {
      id_diccionary_word: {
        id_s: 1,
        id_w: 1,
      },
      word: {
        id: 1,
        sans_word: 'Asana',
        spanish_w: 'postura',
        english_w: 'pose',
      },
    },
    {
      id_diccionary_word: {
        id_s: 1,
        id_w: 25,
      },
      word: {
        id: 25,
        sans_word: 'Tad',
        spanish_w: 'montaña',
        english_w: 'mountain',
      },
    },
  ],
};

test('renderiza el componente correctamente', () => {
  const ejemploProps = {
    spanish: 'Postura de la Montaña',
    english: 'Mountain Pose',
    sansckrit: 'Tadasana',
  };

  const componente = render(<TarjetaPalabra ejemploProps={ejemploProps} />);

  expect(componente).toMatchSnapshot();
});

test('click en el boton de cambiar idioma', () => {
  const ejemploProps = {
    spanish: 'Postura de la Montaña',
    english: 'Mountain Pose',
    sansckrit: 'Tadasana',
  };

  const componente = render(<TarjetaPalabra ejemploProps={ejemploProps} />);

  const botonSanscrito = componente.getByRole('button', { name: 'Sánscrito' });
  const botonEnglish = componente.getByRole('button', { name: 'Inglés' });
  const botonSpanish = componente.getByRole('button', { name: 'Español' });

  fireEvent.click(botonSanscrito);
  fireEvent.click(botonEnglish);
  fireEvent.click(botonSpanish);
});

test('verificar la existencia de elementos en el componente', () => {
  const ejemploProps = {
    spanish: 'Postura de la Montaña',
    english: 'Mountain Pose',
    sansckrit: 'Tadasana',
  };

  const componente = render(<TarjetaPalabra ejemploProps={ejemploProps} />);

  const spanishButton = componente.getByRole('button', { name: 'Español' });
  const englishButton = componente.getByRole('button', { name: 'Inglés' });
  const sansckritButton = componente.getByRole('button', { name: 'Sánscrito' });

  expect(componente).toMatchSnapshot();
  expect(spanishButton).toBeInTheDocument();
  expect(englishButton).toBeInTheDocument();
  expect(sansckritButton).toBeInTheDocument();
});

describe('TarjetaPalabra Component', () => {

  test('debería mostrar la palabra en el idioma seleccionado', () => {
    render(<TarjetaPalabra {...palabra} />);

    // Initial word should be in Sanskrit
    expect(screen.getByText('Tadasana')).toBeInTheDocument();

    // Change language to Spanish
    fireEvent.click(screen.getByText('Español'));
    expect(screen.getByText('Postura de la Montaña')).toBeInTheDocument();

    // Change language to English
    fireEvent.click(screen.getByText('Inglés'));
    expect(screen.getByText('Mountain Pose')).toBeInTheDocument();
  });

  test('debería mostrar la descomposición morfológica con la palabra', () => {
    render(<TarjetaPalabra {...palabra} />);

    // Suponiendo que la descomposición morfológica sigue la palabra en cada idioma
    // Verificar la visualización de la descomposición morfológica en sánscrito
    expect(screen.getByText('Asana')).toBeInTheDocument();
    expect(screen.getByText('Tad')).toBeInTheDocument();

    // Cambiar al idioma español y verificar la descomposición morfológica
    fireEvent.click(screen.getByText('Español'));
    expect(screen.getByText('postura')).toBeInTheDocument();
    expect(screen.getByText('montaña')).toBeInTheDocument();

    // Cambiar al idioma inglés y verificar la descomposición morfológica
    fireEvent.click(screen.getByText('Inglés'));
    expect(screen.getByText('pose')).toBeInTheDocument();
    expect(screen.getByText('mountain')).toBeInTheDocument();
  });
});

test('debería mostrar la palabra buscada con su descomposición morfológica y opciones de idioma', async () => {
  render(<App setIsLoading={false} />);

  const inputBusqueda = screen.getByLabelText("Recipient's username");
  fireEvent.change(inputBusqueda, { target: { value: 'Tadasana' } });

  await waitFor(() => {
    const tadasanaElements = screen.getAllByText('Tadasana');
    expect(tadasanaElements.length).toBeGreaterThan(0);

    const asanaElements = screen.getAllByText('Asana');
    expect(asanaElements.length).toBeGreaterThan(0);

    const spanishButtons = screen.getAllByText('Español');
    expect(spanishButtons.length).toBeGreaterThan(0);

    const englishButtons = screen.getAllByText('Inglés');
    expect(englishButtons.length).toBeGreaterThan(0);
  });
});

test('Renderiza la tarjeta con la palabra y sus traducciones en diferentes idiomas', () => {
  render(<TarjetaPalabra
    spanish={palabra.spanish}
    sansckrit={palabra.sansckrit}
    english={palabra.english}
    diccionaryWordModels={palabra.diccionaryWordModels}
  />);

  // Verifica que se muestre la palabra en sánscrito al inicio
  const sansckritWordElement = screen.getByText('Tadasana');
  expect(sansckritWordElement).toBeInTheDocument();

  // Verifica que al cambiar el idioma a español, se muestre la palabra en español
  const buttonEspanol = screen.getByText('Español');
  fireEvent.click(buttonEspanol);
  const spanishWordElement = screen.getByText('Postura de la Montaña');
  expect(spanishWordElement).toBeInTheDocument();

  // Verifica que al cambiar el idioma a inglés, se muestre la palabra en inglés
  const buttonIngles = screen.getByText('Inglés');
  fireEvent.click(buttonIngles);
  const englishWordElement = screen.getByText('Mountain Pose');
  expect(englishWordElement).toBeInTheDocument();
});

test('La traducción de las palabras cambia según el idioma seleccionado en menos de 3 segundos', async () => {
  render(<TarjetaPalabra {...palabra} />);

  // Verifica que se muestren las palabras en sánscrito inicialmente
  expect(screen.getByText('Tadasana')).toBeInTheDocument();
  expect(screen.getByText('Asana')).toBeInTheDocument();

  // Simula el cambio al español y verifica la traducción dentro del límite de tiempo de 3 segundos
  fireEvent.click(screen.getByText('Español'));
  await waitFor(() => {
    expect(screen.getByText('Postura de la Montaña')).toBeInTheDocument();
    expect(screen.getByText('postura')).toBeInTheDocument();
  }, { timeout: 3000 });

  // Simula el cambio al inglés y verifica la traducción dentro del límite de tiempo de 3 segundos
  fireEvent.click(screen.getByText('Inglés'));
  await waitFor(() => {
    expect(screen.getByText('Mountain Pose')).toBeInTheDocument();
    expect(screen.getByText('pose')).toBeInTheDocument();
  }, { timeout: 3000 });
});
