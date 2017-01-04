// local imports
import { createStore } from 'store'
import reducer, { initialState } from '..'
import { addAnchors, setAnchorLocations } from 'actions/elements'
import { noIdErr } from '../anchors'

describe('Reducers', function() {

    describe('Elements reducer', function() {

        // a store to test with
        let store
        // with one anchor
        const initialAnchor = {
            id: 1,
            x: 50,
            y: 100
        }

        beforeEach(function() {
            // start with a fresh store
            store = createStore()
            // add a single propagator to the store
            store.dispatch(addAnchors(initialAnchor))
        })

        it('responds to the ADD_ANCHOR reducer', function() {
            // make sure the state matches expectation
            expect(store.getState().elements.anchors).to.deep.equal({
                1: {
                    x: 50,
                    y: 100,
                    id: 1,
                }
            })
        })

        it('can add multiple anchors with ADD_ANCHOR', function() {
            // the anchor to test
            const anchors = [
                {
                    id: 2,
                    x: 50,
                    y: 100,
                },
                {
                    id: 3,
                    x: 100,
                    y: 100
                }
            ]

            // add the propagator to the store
            store.dispatch(addAnchors(...anchors))

            // make sure the state matches expectation
            expect(store.getState().elements.anchors).to.deep.equal({
                [initialAnchor.id]: initialAnchor,
                [anchors[0].id]: anchors[0],
                [anchors[1].id]: anchors[1],
            })
        })

        it('barfs if there is an anchor id conflict', function() {

            // the action to add the id-conflicting anchor
            const action = () => store.dispatch(addAnchors({
                id: 1,
                x: 100,
                y: 100,
            }))

            // make sure the id-conflicting action throws an error
            expect(action).to.throw(Error)
        })

        it('can move single anchor with SET_ANCHOR_LOCATIONS action', function() {
            // the anchor to test
            const move = {
                id: initialAnchor.id,
                x: 50,
                y: 100,
            }

            // add the propagator to the store
            store.dispatch(setAnchorLocations(move))

            // make sure the initial anchor has been moved in the right direction
            expect(store.getState().elements.anchors[initialAnchor.id].x).to.equal(move.x)
            expect(store.getState().elements.anchors[initialAnchor.id].y).to.equal(move.y)
        })

        it('can move multiple anchors with SET_ANCHOR_LOCATIONS action', function() {
            const anchor = {
                id: 2,
                x: 50,
                y: 50
            }
            // add a second anchor
            store.dispatch(addAnchors(anchor))

            // the anchor to test
            const moves = [
                {
                    id: initialAnchor.id,
                    x: 50,
                    y: 100,
                },
                {
                    id: anchor.id,
                    x: 50,
                    y: 50
                }
            ]

            // add the propagator to the store
            store.dispatch(setAnchorLocations(...moves))

            // make sure the initial anchor was moved in the right direction
            expect(store.getState().elements.anchors[initialAnchor.id].x).to.equal(moves[0].x)
            expect(store.getState().elements.anchors[initialAnchor.id].y).to.equal(moves[0].y)
            // make sure the new anchor was moved in the right direction
            expect(store.getState().elements.anchors[anchor.id].x).to.equal(moves[1].x)
            expect(store.getState().elements.anchors[anchor.id].y).to.equal(moves[1].y)
        })

        it('only moved the appropriate anchors', function() {
            const anchor = {
                id: 2,
                x: 50,
                y: 50
            }
            // add a second anchor
            store.dispatch(addAnchors(anchor))

            // the move to test
            const move = {
                id: initialAnchor.id,
                x: 50,
                y: 100,
            }

            // add the propagator to the store
            store.dispatch(setAnchorLocations(move))

            // make sure the other anchor was left unmodified
            expect(store.getState().elements.anchors[anchor.id].x).to.equal(anchor.x)
            expect(store.getState().elements.anchors[anchor.id].y).to.equal(anchor.y)
        })

        it('barfs if moving with no id', function() {
            // the move to test
            const move = {
                x: 50,
                y: 100,
            }

            // add the propagator to the store
            expect(() => store.dispatch(setAnchorLocations(move))).to.throw(Error, noIdErr)
        })
    })
})
