package net.ngeor.t3;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private int[][] tileIds;
    private View.OnTouchListener tileTouchListener;
    private GameState gameState = GameState.WaitingHuman;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tileIds = new int[][] {
                new int[]{
                        R.id.tile00,
                        R.id.tile01,
                        R.id.tile02
                },
                new int[]{
                        R.id.tile10,
                        R.id.tile11,
                        R.id.tile12
                },
                new int[]{
                        R.id.tile20,
                        R.id.tile21,
                        R.id.tile22
                }
        };

        tileTouchListener = new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (gameState != GameState.WaitingHuman) {
                    return false;
                }

                if (event.getAction() == MotionEvent.ACTION_UP) {
                    ((TileImageView)v).setState(TileState.O);
                    v.invalidate();
                    humanPlayed();
                }

                return true;
            }
        };

        // add touch listener
        visitTiles(new TileImageViewVisitor() {
            @Override
            public void visit(TileImageView view) {
                view.setOnTouchListener(tileTouchListener);
            }
        });
    }

    private void humanPlayed() {
        final List<TileState> states = new ArrayList<>();
        visitTiles(new TileImageViewVisitor() {
            @Override
            public void visit(TileImageView view) {
                states.add(view.getState());
            }
        });

        if (states.contains(TileState.Empty)) {
            gameState = GameState.WaitingCPU;
            ((TextView)findViewById(R.id.header)).setText("Waiting for CPU...");
            cpuThink(states);
        } else {
            gameState = GameState.Finished;
        }
    }

    private void cpuPlayed() {
        final List<TileState> states = new ArrayList<>();
        visitTiles(new TileImageViewVisitor() {
            @Override
            public void visit(TileImageView view) {
                states.add(view.getState());
            }
        });

        if (states.contains(TileState.Empty)) {
            gameState = GameState.WaitingHuman;
            ((TextView)findViewById(R.id.header)).setText("Waiting for player...");
        } else {
            gameState = GameState.Finished;
        }
    }

    interface TileImageViewVisitor {
        void visit(TileImageView view);
    }

    private void visitTiles(TileImageViewVisitor visitor) {
        for (int[] ids : tileIds) {
            for (int id : ids) {
                visitor.visit((TileImageView)findViewById(id));
            }
        }
    }

    private void cpuThink(List<TileState> tileStates) {
        new AI().execute(tileStates);
    }

    class AI extends AsyncTask<List<TileState>, Void, Integer> {

        @Override
        protected Integer doInBackground(List<TileState>... params) {
            List<TileState> tileStates = params[0];
            for (int i = 0; i < tileStates.size(); i++) {
                if (tileStates.get(i) == TileState.Empty) {
                    return i;
                }
            }

            return null;
        }

        @Override
        protected void onPostExecute(Integer aVoid) {
            super.onPostExecute(aVoid);
            if (aVoid == null) {
                // TODO: fail
                return;
            }

            int tileIndex = aVoid;
            int tileRow = tileIndex / 3;
            int tileCol = tileIndex % 3;
            TileImageView selectedTileView = (TileImageView) findViewById(tileIds[tileRow][tileCol]);
            selectedTileView.setState(TileState.X);
            selectedTileView.invalidate();
            cpuPlayed();
        }
    }
}
